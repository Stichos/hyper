import { Card, CardContent } from "@/components/ui/card";

export default function TimelineSection() {
  const timelineEvents = [
    {
      id: "registration-opens",
      date: "April 3rd, 2:00 PM UTC",
      title: "Registration opens",
      icon: "https://ext.same-assets.com/1999836307/3281320694.svg",
    },
    {
      id: "registration-closes",
      date: "April 14th, 3:59 AM UTC",
      title: "Registration closes",
      icon: "https://ext.same-assets.com/1999836307/3281320694.svg",
    },
    {
      id: "claim-period-opens",
      date: "April 22nd, 11:00 AM UTC",
      title: "Claim period opens",
      icon: "https://ext.same-assets.com/1999836307/1547238301.svg",
    },
    {
      id: "claim-period-closes",
      date: "May 6th, 3:59 AM UTC",
      title: "Claim period closes",
      icon: "https://ext.same-assets.com/1999836307/736604384.svg",
    },
  ];

  return (
    <Card className="border-0 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Timeline</h2>
        <div className="space-y-6">
          {timelineEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="mt-1">
                <img src={event.icon} alt={event.title} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{event.date}</p>
                <p className="font-medium">{event.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
