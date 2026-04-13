const pool = require('../config/db');

// GET /api/dashboard?empresa_id=1&ano=2025
async function getDashboard(req, res) {
  const { empresa_id = 1, ano = 2025 } = req.query;

  try {
    // Receita e Custo por mês
    const mensalQuery = await pool.query(`
      SELECT
        m.mes,
        COALESCE(SUM(e.valor), 0) AS receita,
        COALESCE(SUM(s.valor), 0) AS custo
      FROM generate_series(1,12) AS m(mes)
      LEFT JOIN entradas e ON e.mes = m.mes AND e.ano = $2 AND e.empresa_id = $1
      LEFT JOIN saidas s ON s.mes = m.mes AND s.ano = $2 AND s.empresa_id = $1
      GROUP BY m.mes
      ORDER BY m.mes
    `, [empresa_id, ano]);

    const meses = mensalQuery.rows;

    const receita_anual = meses.reduce((sum, m) => sum + parseFloat(m.receita), 0);
    const custo_anual = meses.reduce((sum, m) => sum + parseFloat(m.custo), 0);
    const lucro_liquido = receita_anual - custo_anual;
    const margem_liquida = receita_anual > 0 ? lucro_liquido / receita_anual : 0;

    const meses_lucrativos = meses.filter(m => (parseFloat(m.receita) - parseFloat(m.custo)) > 0).length;
    const melhor_mes = meses.reduce((best, m) => {
      const lucro = parseFloat(m.receita) - parseFloat(m.custo);
      return lucro > best.lucro ? { mes: m.mes, lucro } : best;
    }, { mes: 0, lucro: -Infinity });

    // Custos por categoria (anual)
    const custosCategoria = await pool.query(`
      SELECT cc.nome, cc.icone, cc.tipo, COALESCE(SUM(s.valor), 0) AS total
      FROM categorias_custo cc
      LEFT JOIN saidas s ON s.categoria_id = cc.id AND s.ano = $2 AND s.empresa_id = $1
      GROUP BY cc.id, cc.nome, cc.icone, cc.tipo
      HAVING COALESCE(SUM(s.valor), 0) > 0
      ORDER BY total DESC
    `, [empresa_id, ano]);

    // Receitas por categoria (anual)
    const receitasCategoria = await pool.query(`
      SELECT cr.nome, cr.icone, COALESCE(SUM(e.valor), 0) AS total
      FROM categorias_receita cr
      LEFT JOIN entradas e ON e.categoria_id = cr.id AND e.ano = $2 AND e.empresa_id = $1
      GROUP BY cr.id, cr.nome, cr.icone
      HAVING COALESCE(SUM(e.valor), 0) > 0
      ORDER BY total DESC
    `, [empresa_id, ano]);

    res.json({
      kpis: {
        receita_anual,
        custo_anual,
        lucro_liquido,
        margem_liquida,
        meses_lucrativos,
        melhor_mes: melhor_mes.mes,
        melhor_mes_valor: melhor_mes.lucro,
      },
      mensal: meses.map(m => ({
        mes: m.mes,
        receita: parseFloat(m.receita),
        custo: parseFloat(m.custo),
        lucro: parseFloat(m.receita) - parseFloat(m.custo),
        margem: parseFloat(m.receita) > 0 ? (parseFloat(m.receita) - parseFloat(m.custo)) / parseFloat(m.receita) : 0,
      })),
      custos_por_categoria: custosCategoria.rows,
      receitas_por_categoria: receitasCategoria.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
}

module.exports = { getDashboard };
