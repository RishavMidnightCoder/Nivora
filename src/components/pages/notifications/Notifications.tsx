import { Users, CircleAlert, Check, UserPlus } from "lucide-react";

const notifications = [
  { icon: UserPlus, title: "You were assigned to NOVA-142", time: "12 min ago", tone: "bg-[#eaf0ff] text-[#536fd8]" },
  { icon: CircleAlert, title: "NOVA-138 is now critical", time: "1 hour ago", tone: "bg-[#fdebed] text-[#d76a71]" },
  { icon: Check, title: "Jordan completed WEB-094", time: "3 hours ago", tone: "bg-[#e6f7ef] text-[#43a77c]" },
  { icon: Users, title: "Taylor was invited to your workspace", time: "Yesterday", tone: "bg-[#f1eafa] text-[#9574ca]" },
];

const filters = ["All", "Mentions", "Tasks", "Team"];

export default function Notifications() {
  return (
    <div className="mx-auto max-w-[1500px] p-[38px] pb-[60px] max-[1100px]:px-[24px] max-[760px]:p-[24px_14px_28px]">
      <div className="mb-[26px]">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#a0a9b5]">
          Activity center
        </p>
        <h1 className="m-0 font-display text-[42px] max-[760px]:text-[30px] font-medium tracking-[-0.05em] text-[#172238]">
          Notifications
        </h1>
        <p className="mt-2 text-[13px] text-[#778293]">
          Review the latest activity from your workspace.
        </p>
      </div>

      <section className="rounded-[9px] border border-[#e5e8ed] bg-white">
        <div className="flex items-start justify-between p-[21px_21px_18px] max-[760px]:flex-col max-[760px]:gap-[12px]">
          <div>
            <h2 className="m-0 mb-[5px] text-[14px] tracking-[-0.02em] text-[#172238]">Notifications</h2>
            <p className="m-0 text-[11px] text-[#8d97a4]">Stay up to date with activity across your workspace.</p>
          </div>
          <button className="cursor-pointer whitespace-nowrap text-[11px] font-extrabold text-[#284bce]">
            Mark all read
          </button>
        </div>

        <div className="flex gap-[5px] px-[21px] pb-[16px] max-[760px]:px-[14px]">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`cursor-pointer rounded-[6px] px-3 py-[8px] text-[12px] font-bold ${
                filter === "All" ? "bg-[#edf1ff] text-[#284bce]" : "text-[#778293]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="border-t border-[#e5e8ed]">
          {notifications.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-[12px] border-b border-[#f1f2f4] px-[21px] py-[14px] max-[760px]:px-[14px]"
            >
              <span className={`grid h-[32px] w-[32px] flex-shrink-0 place-items-center rounded-[8px] ${item.tone}`}>
                <item.icon size={16} />
              </span>
              <span className="flex flex-1 flex-col gap-[2px]">
                <b className="text-[12px] font-bold text-[#172238]">{item.title}</b>
                <small className="text-[10px] text-[#9ba4b0]">{item.time}</small>
              </span>
              <i className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#284bce]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}