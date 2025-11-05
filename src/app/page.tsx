import PastebinForm from "./components/pastebin-form";

export default function Home() {
  return (
    <section className="flex flex-col gap-4 text-pretty">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          Create and share your paste securely with custom expiration and PIN options
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Add your text or code snippet below and set how long it should stay accessible. You can
          also add a PIN for extra privacy, when the time’s up, your paste will automatically expire
          and disappear.
        </p>
      </div>
      <PastebinForm />
    </section>
  );
}
