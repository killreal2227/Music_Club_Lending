export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { name, phone, direction } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: 'Имя и телефон обязательны'
      });
    }

    const token = process.env.ALFACRM_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: 'ALFACRM_TOKEN не найден'
      });
    }

    const crmResponse = await fetch(
      `https://musicclubmsk.s20.online/api/7/lead/create?token=${encodeURIComponent(token)}`,
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

    const crmText = await crmResponse.text();

    if (!crmResponse.ok) {
      return res.status(502).json({
        error: 'Ошибка АльфаCRM',
        crm_status: crmResponse.status,
        crm_response: crmText
      });
    }

    return res.status(200).json({
      success: true,
      crm_status: crmResponse.status
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Ошибка сервера',
      details: error.message
    });
  }
}
