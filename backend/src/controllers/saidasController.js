const pool = require('../config/db');

// GET /api/saidas?empresa_id=1&ano=2025
async function getSaidas(req, res) {
  const { empresa_id = 1, ano = 2025 } = req.query;
  try {
    const result = await pool.query(`
      SELECT
        cc.id AS categoria_id,
        cc.nome,
        cc.icone,
        cc.tipo,
        COALESCE(MAX(CASE WHEN s.mes = 1 THEN s.valor END), 0) AS jan,
        COALESCE(MAX(CASE WHEN s.mes = 2 THEN s.valor END), 0) AS fev,
        COALESCE(MAX(CASE WHEN s.mes = 3 THEN s.valor END), 0) AS mar,
        COALESCE(MAX(CASE WHEN s.mes = 4 THEN s.valor END), 0) AS abr,
        COALESCE(MAX(CASE WHEN s.mes = 5 THEN s.valor END), 0) AS mai,
        COALESCE(MAX(CASE WHEN s.mes = 6 THEN s.valor END), 0) AS jun,
        COALESCE(MAX(CASE WHEN s.mes = 7 THEN s.valor END), 0) AS jul,
        COALESCE(MAX(CASE WHEN s.mes = 8 THEN s.valor END), 0) AS ago,
        COALESCE(MAX(CASE WHEN s.mes = 9 THEN s.valor END), 0) AS set,
        COALESCE(MAX(CASE WHEN s.mes = 10 THEN s.valor END), 0) AS out,
        COALESCE(MAX(CASE WHEN s.mes = 11 THEN s.valor END), 0) AS nov,
        COALESCE(MAX(CASE WHEN s.mes = 12 THEN s.valor END), 0) AS dez,
        COALESCE(SUM(s.valor), 0) AS total_anual
      FROM categorias_custo cc
      LEFT JOIN saidas s ON s.categoria_id = cc.id AND s.empresa_id = $1 AND s.ano = $2
      WHERE cc.ativo = true
      GROUP BY cc.id, cc.nome, cc.icone, cc.tipo
      ORDER BY cc.id
    `, [empresa_id, ano]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar saídas' });
  }
}

// PUT /api/saidas
async function upsertSaida(req, res) {
  const { empresa_id, categoria_id, ano, mes, valor } = req.body;
  if (!empresa_id || !categoria_id || !ano || !mes || valor === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' });
  }
  try {
    const result = await pool.query(`
      INSERT INTO saidas (empresa_id, categoria_id, ano, mes, valor)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (empresa_id, categoria_id, ano, mes)
      DO UPDATE SET valor = $5, atualizado_em = NOW()
      RETURNING *
    `, [empresa_id, categoria_id, ano, mes, valor]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao guardar saída' });
  }
}

module.exports = { getSaidas, upsertSaida };
