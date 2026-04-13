const pool = require('../config/db');

// GET /api/alertas?empresa_id=1&ano=2025
async function getAlertas(req, res) {
  const { empresa_id = 1, ano = 2025 } = req.query;

  try {
    // Calcular totais
    const totaisQuery = await pool.query(`
      SELECT
        COALESCE((SELECT SUM(e.valor) FROM entradas e WHERE e.empresa_id = $1 AND e.ano = $2), 0) AS receita_anual,
        COALESCE((SELECT SUM(s.valor) FROM saidas s WHERE s.empresa_id = $1 AND s.ano = $2), 0) AS custo_anual,
        COALESCE((SELECT SUM(s.valor) FROM saidas s
          JOIN categorias_custo cc ON cc.id = s.categoria_id
          WHERE s.empresa_id = $1 AND s.ano = $2 AND cc.tipo = 'CMV'), 0) AS cmv,
        COALESCE((SELECT SUM(s.valor) FROM saidas s
          JOIN categorias_custo cc ON cc.id = s.categoria_id
          WHERE s.empresa_id = $1 AND s.ano = $2 AND cc.nome = 'Salários e Encargos Sociais'), 0) AS salarios,
        COALESCE((SELECT SUM(s.valor) FROM saidas s
          JOIN categorias_custo cc ON cc.id = s.categoria_id
          WHERE s.empresa_id = $1 AND s.ano = $2 AND cc.nome = 'Marketing e Publicidade'), 0) AS marketing
    `, [empresa_id, ano]);

    const t = totaisQuery.rows[0];
    const receita = parseFloat(t.receita_anual);
    const custo = parseFloat(t.custo_anual);
    const cmv = parseFloat(t.cmv);
    const salarios = parseFloat(t.salarios);
    const marketing = parseFloat(t.marketing);
    const lucro = receita - custo;
    const margem = receita > 0 ? lucro / receita : 0;

    const alertas = [
      {
        id: 1,
        area: 'Margem Líquida',
        indicador: `${(margem * 100).toFixed(1)}% (ref: >20%)`,
        estado: margem >= 0.20 ? 'ok' : margem >= 0.15 ? 'atencao' : 'critico',
        diagnostico: margem >= 0.20 ? 'Margem saudável acima de 20%' : margem >= 0.15 ? 'Margem abaixo do ideal' : 'Margem crítica — revisar preços',
        acao: 'Revisar tabela de preços — margem mínima por projecto',
      },
      {
        id: 2,
        area: 'Peso CMV',
        indicador: receita > 0 ? `${(cmv / receita * 100).toFixed(1)}% da receita (ref: <35%)` : 'Sem dados',
        estado: receita > 0 && cmv / receita <= 0.35 ? 'ok' : 'atencao',
        diagnostico: receita > 0 && cmv / receita <= 0.35 ? 'CMV eficiente abaixo de 35%' : 'CMV acima do recomendado',
        acao: 'Negociar contratos de volume com 2-3 fornecedores',
      },
      {
        id: 3,
        area: 'Peso Salários',
        indicador: receita > 0 ? `${(salarios / receita * 100).toFixed(1)}% da receita (ref: <25%)` : 'Sem dados',
        estado: receita > 0 && salarios / receita <= 0.25 ? 'ok' : salarios / receita <= 0.35 ? 'atencao' : 'critico',
        diagnostico: receita > 0 && salarios / receita > 0.30 ? 'Salários acima de 30% — avaliar produtividade' : 'Peso salarial controlado',
        acao: 'Implementar salário base + comissão por projecto',
      },
      {
        id: 4,
        area: 'Marketing',
        indicador: receita > 0 ? `${(marketing / receita * 100).toFixed(1)}% da receita (ref: 3-5%)` : 'Sem dados',
        estado: receita > 0 && marketing / receita >= 0.03 && marketing / receita <= 0.05 ? 'ok' : 'atencao',
        diagnostico: 'Verificar eficiência dos canais de marketing',
        acao: 'Redirigir budget para canais digitais de alto retorno',
      },
    ];

    res.json({
      resumo: {
        criticos: alertas.filter(a => a.estado === 'critico').length,
        atencao: alertas.filter(a => a.estado === 'atencao').length,
        ok: alertas.filter(a => a.estado === 'ok').length,
      },
      alertas,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao calcular alertas' });
  }
}

module.exports = { getAlertas };
