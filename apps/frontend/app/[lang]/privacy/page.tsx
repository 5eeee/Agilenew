import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function Privacy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ru = lang === "ru";

  return (
    <article className="legal shell">
      <header><span>{ru ? "Редакция от 1 августа 2026 года" : "Effective August 1, 2026"}</span><h1>{ru ? "Политика обработки персональных данных" : "Personal Data Processing Policy"}</h1></header>
      <p>{ru ? "Настоящая Политика определяет порядок и условия обработки персональных данных пользователей сайта agile-business-pro.com компанией Agile Business (далее — Оператор)." : "This Policy describes how Agile Business (the Controller) processes personal data submitted through agile-business-pro.com."}</p>
      <h2>{ru ? "1. Общие положения" : "1. General provisions"}</h2>
      <p>{ru ? "Политика составлена с учётом требований Федерального закона № 152-ФЗ «О персональных данных». Оператор обрабатывает данные законно, добросовестно и только в объёме, необходимом для заявленных целей." : "The Controller processes data lawfully, fairly and only to the extent necessary for the purposes stated below."}</p>
      <h2>{ru ? "2. Какие данные обрабатываются" : "2. Data we process"}</h2>
      <p>{ru ? "Имя, номер телефона, адрес электронной почты, название компании, содержание обращения, выбранные параметры расчёта проекта, а также технические сведения, передаваемые браузером: IP-адрес, cookie, тип устройства и данные о посещении страниц." : "Name, phone number, email, company, inquiry details, project estimate selections and technical browser data such as IP address, cookies, device type and page activity."}</p>
      <h2>{ru ? "3. Цели и правовые основания" : "3. Purposes and legal basis"}</h2>
      <p>{ru ? "Данные используются для ответа на обращение, подготовки коммерческого предложения, заключения и исполнения договора, улучшения сайта и обеспечения его безопасности. Основания обработки — согласие пользователя, действия по запросу пользователя до заключения договора и исполнение договора." : "Data is used to respond to inquiries, prepare proposals, perform contracts, improve the website and protect its security. Processing is based on consent, pre-contractual steps and contract performance."}</p>
      <h2>{ru ? "4. Порядок, сроки хранения и передача" : "4. Processing, retention and sharing"}</h2>
      <p>{ru ? "Обработка осуществляется автоматизированным и неавтоматизированным способом. Данные хранятся не дольше, чем этого требуют цели обработки или применимое законодательство. Доступ получают только уполномоченные лица и подрядчики, которым данные необходимы для работы сайта и коммуникации. Оператор не продаёт персональные данные." : "Data may be processed electronically or manually and is retained only as long as necessary. Access is limited to authorized staff and service providers supporting the website and communications. Personal data is never sold."}</p>
      <h2>{ru ? "5. Защита данных" : "5. Data security"}</h2>
      <p>{ru ? "Оператор применяет организационные и технические меры защиты от неправомерного доступа, изменения, блокирования, копирования и распространения данных, включая ограничение доступа, защищённую передачу и контроль инфраструктуры." : "The Controller uses organizational and technical safeguards against unauthorized access, alteration, loss or disclosure, including access controls, secure transmission and infrastructure monitoring."}</p>
      <h2>{ru ? "6. Права пользователя" : "6. Your rights"}</h2>
      <p>{ru ? "Пользователь вправе запросить сведения об обработке, уточнение, блокирование или удаление данных, а также отозвать согласие. Для этого необходимо направить обращение на info@agile-business-pro.com. Оператор ответит в срок, установленный применимым законодательством." : "You may request access, correction, restriction or deletion of your data and may withdraw consent by emailing info@agile-business-pro.com."}</p>
      <h2>{ru ? "7. Cookie и аналитика" : "7. Cookies and analytics"}</h2>
      <p>{ru ? "Сайт может использовать необходимые cookie для корректной работы и аналитические cookie после получения соответствующего согласия. Пользователь может ограничить cookie в настройках браузера." : "The website may use essential cookies and, with appropriate consent, analytics cookies. Cookies can be restricted in browser settings."}</p>
      <h2>{ru ? "8. Контакты Оператора" : "8. Controller contacts"}</h2>
      <p>Agile Business<br />info@agile-business-pro.com<br />+7 (963) 617-73-73</p>
      <p className="legal-note">{ru ? "При изменении юридических реквизитов Оператора актуальная информация публикуется в этой Политике до начала соответствующей обработки." : "Updated controller details will be published in this Policy before the relevant processing begins."}</p>
    </article>
  );
}
