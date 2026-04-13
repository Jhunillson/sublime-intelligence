const pool = require('../config/db');

// GET /api/faturas?empresa_id=1
async function getFaturas(req, res) {
  const { empresa_id = 1 } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM faturas WHERE empresa_id = $1 ORDER BY data_fatura DESC`,
      [empresa_id]
    );

    const totais = await pool.query(`
      SELECT
        COALESCE(SUM(valor_base), 0) AS total_faturado,
        COALESCE(SUM(iva_valor), 0) AS iva_a_pagar,
        COALESCE(SUM(pago), 0) AS valor_recebido,
        COALESCE(SUM(pendente), 0) AS pendente_total,
        COUNT(*) AS num_faturas,
        COUNT(*) FILTER (WHERE status = 'pago') AS faturas_pagas,
        CASE WHEN COUNT(*) > 0 THEN ROUND(COUNT(*) FILTER (WHERE status = 'pago') * 100.0 / COUNT(*), 1) ELSE 0 END AS taxa_cobranca,
        CASE WHEN COUNT(*) > 0 THEN ROUND(AVG(valor_base)::numeric, 2) ELSE 0 END AS ticket_medio
      FROM faturas WHERE empresa_id = $1
    `, [empresa_id]);

    res.json({ faturas: result.rows, totais: totais.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar faturas' });
  }
}

// POST /api/faturas
async function createFatura(req, res) {
  const { empresa_id, data_fatura, cliente, numero_fatura, descricao, valor_base, iva_percentagem = 14, pago = 0, status = 'pendente', observacoes } = req.body;
  if (!empresa_id || !data_fatura || !cliente || !valor_base) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' });
  }
  try {
    const result = await pool.query(`
      INSERT INTO faturas (empresa_id, data_fatura, cliente, numero_fatura, descricao, valor_base, iva_percentagem, pago, status, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [empresa_id, data_fatura, cliente, numero_fatura, descricao, valor_base, iva_percentagem, pago, status, observacoes]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar fatura' });
  }
}

// PUT /api/faturas/:id
async function updateFatura(req, res) {
  const { id } = req.params;
  const { data_fatura, cliente, numero_fatura, descricao, valor_base, iva_percentagem, pago, status, observacoes } = req.body;
  try {
    const result = await pool.query(`
      UPDATE faturas SET
        data_fatura = COALESCE($1, data_fatura),
        cliente = COALESCE($2, cliente),
        numero_fatura = COALESCE($3, numero_fatura),
        descricao = COALESCE($4, descricao),
        valor_base = COALESCE($5, valor_base),
        iva_percentagem = COALESCE($6, iva_percentagem),
        pago = COALESCE($7, pago),
        status = COALESCE($8, status),
        observacoes = COALESCE($9, observacoes)
      WHERE id = $10
      RETURNING *
    `, [data_fatura, cliente, numero_fatura, descricao, valor_base, iva_percentagem, pago, status, observacoes, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Fatura não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao actualizar fatura' });
  }
}

// DELETE /api/faturas/:id
async function deleteFatura(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM faturas WHERE id = $1', [id]);
    res.json({ message: 'Fatura eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar fatura' });
  }
}

module.exports = { getFaturas, createFatura, updateFatura, deleteFatura };
