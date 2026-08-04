"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body>
        <main className="error-page shell">
          <span>500</span>
          <h1>Сервис временно недоступен</h1>
          <p>Мы уже можем повторно загрузить интерфейс.</p>
          <button className="button" type="button" onClick={reset}>Повторить</button>
        </main>
      </body>
    </html>
  );
}
