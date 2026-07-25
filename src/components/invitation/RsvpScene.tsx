import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { Divider } from "./Ornaments";

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80, "That name is a little long"),
  guests: z.coerce.number().int().min(1, "At least one guest").max(12, "Please contact us directly"),
  attending: z.enum(["yes", "no"]),
  note: z.string().trim().max(400, "Please keep your dua under 400 characters").optional(),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

/** Scene 11 — RSVP as a handwritten note rather than a form. */
export function RsvpScene() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      guests: fd.get("guests"),
      attending: fd.get("attending"),
      note: fd.get("note"),
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof Errors] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSent(true);
    toast.success("Thank you — your response is noted with love.");
  };

  const field =
    "w-full border-0 border-b border-champagne/50 bg-transparent px-1 pb-2 font-script text-2xl text-ink placeholder:font-body placeholder:text-sm placeholder:tracking-widest placeholder:text-muted-foreground/70 focus:border-olivegold focus:outline-none";

  return (
    <section className="relative px-6 py-28" aria-labelledby="rsvp-title">
      <div className="mx-auto max-w-xl">
        <Reveal className="text-center">
          <p className="eyebrow">a word from you</p>
          <h2 id="rsvp-title" className="mt-4 font-display text-3xl text-ink sm:text-4xl">
            Will you join us?
          </h2>
          <Divider className="mt-8" />
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          {sent ? (
            <div className="paper rounded-sm px-8 py-16 text-center">
              <p className="font-script text-4xl text-ink">Jazakum Allahu Khayran</p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Your response has been received. We look forward to seeing you, in sha Allah.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="paper rounded-sm px-7 py-12 sm:px-12">
              <div className="space-y-10">
                <div>
                  <label htmlFor="name" className="eyebrow">
                    Your name
                  </label>
                  <input id="name" name="name" className={`${field} mt-4`} placeholder="Write here" />
                  {errors.name && (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <span className="eyebrow">Will you be with us?</span>
                  <div className="mt-4 flex gap-8">
                    {[
                      { v: "yes", l: "Joyfully yes" },
                      { v: "no", l: "With regret, no" },
                    ].map((o, i) => (
                      <label
                        key={o.v}
                        className="flex cursor-pointer items-center gap-3 text-sm text-ink"
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={o.v}
                          defaultChecked={i === 0}
                          className="h-4 w-4 accent-[color:var(--olivegold)]"
                        />
                        {o.l}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="eyebrow">
                    Number of guests
                  </label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    max={12}
                    defaultValue={2}
                    className={`${field} mt-4`}
                  />
                  {errors.guests && (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {errors.guests}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="note" className="eyebrow">
                    A dua or message
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    maxLength={400}
                    className={`${field} mt-4 resize-none leading-relaxed`}
                    placeholder="Optional"
                  />
                  {errors.note && (
                    <p className="mt-2 text-xs text-destructive" role="alert">
                      {errors.note}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-12 w-full border border-champagne/60 py-4 text-xs uppercase tracking-[0.32em] text-ink transition-colors duration-500 hover:bg-champagne/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Send with love
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
