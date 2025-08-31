export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing file id' });
  }

  try {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Drive: ${response.statusText}`);
    }

    // Passa os headers originais
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length') || '');

    // Faz o streaming do arquivo
    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
