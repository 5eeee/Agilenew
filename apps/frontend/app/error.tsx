"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page shell">
      <span>500</span>
      <h1>Не удалось открыть страницу</h1>
      <p>Попробуйте ещё раз. Если ошибка повторится, напишите нам.</p>
      <button className="button" type="button" onClick={reset}>Повторить</button>
    </main>
  );
}
