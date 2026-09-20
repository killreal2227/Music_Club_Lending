export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, direction } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: 'Имя и телефон обязательны'
      });
    }

    const response = await fetch(
      `https://musicclubmsk.s20.online/api/7/lead/create?token=${process.env.ALFACRM_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          name: name,
          phone: phone,
          source: 'Сайт Music Club',
          note: `Направление: ${direction || 'Не выбрано'}`
        })
      }
    );

    const result = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: 'Ошибка АльфаCRM',
        details: result
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Ошибка сервера'
    });
  }
}
