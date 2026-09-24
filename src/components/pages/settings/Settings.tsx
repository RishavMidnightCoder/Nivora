export default function Settings() {
  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Workspace configuration
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Settings
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Configure your workspace and team defaults.
        </p>
      </div>

      <div className="grid grid-cols-[180px_1fr] max-[760px]:grid-cols-1 gap-[22px] max-[760px]:gap-[14px]">
        <aside className="flex flex-col gap-[4px] max-[760px]:hidden">
          <b className="mb-[6px] px-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#9ba4b0]">
            Workspace settings
          </b>
          <button className="min-h-[36px] cursor-pointer rounded-[6px] bg-[#edf1ff] px-3 text-left text-[12px] font-bold text-[#284bce]">
            General
          </button>
        </aside>

        <section className="rounded-[9px] border border-[#e5e8ed] bg-white p-[24px] max-[760px]:p-[18px]">
          <div className="mb-[22px]">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
              Workspace configuration
            </p>
            <h2 className="m-0 font-display text-[20px] font-medium tracking-[-0.02em] text-[#172238]">
              Workspace settings
            </h2>
            <p className="mt-1 text-[12px] text-[#778293]">
              Manage your Nivora workspace defaults and experience.
            </p>
          </div>

          <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[16px]">
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Workspace name
              <input
                defaultValue="Nivora"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Workspace URL
              <input
                defaultValue="nivora.workspace"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none focus:border-[#7890e5]"
              />
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Default project
              <select
                defaultValue="Nova Mobile"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
              >
                <option>Nova Mobile</option>
                <option>Website refresh</option>
                <option>Operations</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Default task view
              <select
                defaultValue="Board"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
              >
                <option>Board</option>
                <option>List</option>
                <option>Calendar</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Week starts on
              <select
                defaultValue="Monday"
                className="min-h-[43px] rounded-[6px] border border-[#e5e8ed] px-3 text-[13px] font-normal text-[#182230] outline-none"
              >
                <option>Monday</option>
                <option>Sunday</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[11px] font-bold text-[#536174]">
              Workspace timezone
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

          <div className="mt-[28px] border-t border-[#e5e8ed] pt-[20px]">
            <h3 className="m-0 mb-[14px] text-[13px] font-bold text-[#172238]">
              Workspace preferences
            </h3>
            <label className="flex items-center justify-between gap-[16px] py-[10px]">
              <span className="flex flex-col gap-[2px]">
                <b className="text-[12px] font-bold text-[#172238]">Show completed tasks</b>
                <small className="text-[10px] text-[#9ba4b0]">
                  Keep completed work visible in project views.
                </small>
              </span>
              <input type="checkbox" defaultChecked className="h-[16px] w-[16px] cursor-pointer accent-[#284bce]" />
            </label>
            <label className="flex items-center justify-between gap-[16px] py-[10px]">
              <span className="flex flex-col gap-[2px]">
                <b className="text-[12px] font-bold text-[#172238]">Use compact layout</b>
                <small className="text-[10px] text-[#9ba4b0]">
                  Display more projects and tasks on screen.
                </small>
              </span>
              <input type="checkbox" className="h-[16px] w-[16px] cursor-pointer accent-[#284bce]" />
            </label>
          </div>

          <div className="mt-[24px] flex justify-end gap-[9px]">
            <button className="inline-flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-[#e5e8ed] px-[10px] py-[7px] text-[11px] font-bold text-[#667384]">
              Discard changes
            </button>
            <button className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] bg-[#284bce] px-[14px] text-[13px] font-bold text-white shadow-[0_3px_8px_#284bce2c]">
              Save settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}