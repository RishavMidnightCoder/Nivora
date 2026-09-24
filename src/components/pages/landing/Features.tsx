export default function Features() {
  return (
    <>
      <section className="mx-auto flex max-w-[1112px] items-center justify-between gap-5 px-[34px] pb-[38px] pt-[18px] text-[10px] tracking-[.12em] text-[#a0a9b5]">
        <span>BUILT FOR TEAMS WHO</span>
        <b className="text-[10px] tracking-[.06em] text-[#6c788a]">PLAN WITH CLARITY</b>
        <b className="text-[10px] tracking-[.06em] text-[#6c788a]">SHIP WITH PURPOSE</b>
        <b className="text-[10px] tracking-[.06em] text-[#6c788a]">GROW TOGETHER</b>
      </section>

      <section
        id="landing-features"
        className="mx-auto grid max-w-[1180px] gap-[70px] px-[34px] pb-[125px] pt-[110px] lg:grid-cols-[0.7fr_1.3fr]"
      >
        <div>
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#76859a]">
            One clear view
          </p>
          <h2 className="m-0 font-display font-medium leading-[1] tracking-[-0.06em] text-[#172238] text-[clamp(42px,5vw,65px)]">
            Less chasing.
            <br />
            <em className="not-italic text-[#284bce]">More doing.</em>
          </h2>
        </div>

        <div className="grid gap-[30px] sm:grid-cols-3">
          {[
            { n: "01", title: "Bring the work together", body: "Tasks, projects, priorities, and people live in one focused view." },
            { n: "02", title: "Know what matters now", body: "See momentum at a glance and give critical work the attention it deserves." },
            { n: "03", title: "Move as one team", body: "Keep everyone aligned without adding another layer of meetings." },
          ].map((item) => (
            <article key={item.n} className="border-t border-[#dfe3e9] pt-[17px]">
              <span className="text-[11px] font-extrabold text-[#284bce]">{item.n}</span>
              <h3 className="my-[36px] mt-9 mb-[10px] text-[15px] text-[#263348]">{item.title}</h3>
              <p className="m-0 text-xs leading-[1.65] text-[#7b8798]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}