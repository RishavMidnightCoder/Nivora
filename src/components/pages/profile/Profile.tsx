export default function Profile() {
  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Your account
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Profile
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Manage your personal details and preferences.
        </p>
      </div>

      <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
        <div className="mb-[28px] flex items-center gap-[16px] max-[600px]:flex-col max-[600px]:items-start">
          <span className="grid h-[56px] w-[56px] flex-shrink-0 place-items-center rounded-full border-2 border-white bg-[#dc9a67] text-[16px] font-extrabold text-white">
            AM
          </span>
          <div className="flex-1">
            <h2 className="m-0 font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
              Alex Morgan
            </h2>
            <p className="mt-1 text-[12px] text-[#778293]">Product lead · Nivora workspace</p>
          </div>
          <button className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384] max-[600px]:w-full max-[600px]:justify-center">
            Edit profile
          </button>
        </div>

        <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[16px]">
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Full name
            <input
              defaultValue="Alex Morgan"
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Work email
            <input
              defaultValue="alex@Nivora.dev"
              type="email"
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Role
            <input
              defaultValue="Workspace admin"
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
            />
          </label>
          <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
            Timezone
            <select
              defaultValue="Pacific Time"
              className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
            >
              <option>Pacific Time</option>
              <option>Eastern Time</option>
              <option>UTC</option>
            </select>
          </label>
        </div>

        <div className="mt-[24px] flex justify-end">
          <button className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c]">
            Save profile
          </button>
        </div>
      </section>
    </div>
  );
}