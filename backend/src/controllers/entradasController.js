const pool = require('../config/db');

// GET /api/entradas?empresa_id=1&ano=2025
async function getEntradas(req, res) {
  const { empresa_id = 1, ano = 2025 } = req.query;
  try {
    const result = await pool.query(`
      SELECT
        cr.id AS categoria_id,
        cr.nome,
        cr.icone,
        COALESCE(MAX(CASE WHEN e.mes = 1 THEN e.valor END), 0) AS jan,
        COALESCE(MAX(CASE WHEN e.mes = 2 THEN e.valor END), 0) AS fev,
        COALESCE(MAX(CASE WHEN e.mes = 3 THEN e.valor END), 0) AS mar,
        COALESCE(MAX(CASE WHEN e.mes = 4 THEN e.valor END), 0) AS abr,
        COALESCE(MAX(CASE WHEN e.mes = 5 THEN e.valor END), 0) AS mai,
        COALESCE(MAX(CASE WHEN e.mes = 6 THEN e.valor END), 0) AS jun,
        COALESCE(MAX(CASE WHEN e.mes = 7 THEN e.valor END), 0) AS jul,
        COALESCE(MAX(CASE WHEN e.mes = 8 THEN e.valor END), 0) AS ago,
        COALESCE(MAX(CASE WHEN e.mes = 9 THEN e.valor END), 0) AS set,
        COALESCE(MAX(CASE WHEN e.mes = 10 THEN e.valor END), 0) AS out,
        COALESCE(MAX(CASE WHEN e.mes = 11 THEN e.valor END), 0) AS nov,
        COALESCE(MAX(CASE WHEN e.mes = 12 THEN e.valor END), 0) AS dez,
        COALESCE(SUM(e.valor), 0) AS total_anual
      FROM categorias_receita cr
      LEFT JOIN entradas e ON e.categoria_id = cr.id AND e.empresa_id = $1 AND e.ano = $2
      WHERE cr.ativo = true
      GROUP BY cr.id, cr.nome, cr.icone
      ORDER BY cr.id
    `, [empresa_id, ano]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar entradas' });
  }
}

// PUT /api/entradas — upsert valor por categoria/mês
async function upsertEntrada(req, res) {
  const { empresa_id, categoria_id, ano, mes, valor } = req.body;
  if (!empresa_id || !categoria_id || !ano || !mes || valor === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' });
  }
  try {
    const result = await pool.query(`
      INSERT INTO entradas (empresa_id, categoria_id, ano, mes, valor)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (empresa_id, categoria_id, ano, mes)
      DO UPDATE SET valor = $5, atualizado_em = NOW()
      RETURNING *
    `, [empresa_id, categoria_id, ano, mes, valor]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao guardar entrada' });
  }
}

module.exports = { getEntradas, upsertEntrada };
