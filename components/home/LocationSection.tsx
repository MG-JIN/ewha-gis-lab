import Card from "@/components/ui/Card";

export default function LocationSection() {
  return (
    <section className="mt-16">
      <h2 className="mb-4 text-xl font-semibold text-ewha-green-900">Location</h2>
      <div className="grid gap-6 sm:grid-cols-5">
        <div className="h-96 overflow-hidden rounded-lg border border-gray-200 sm:col-span-3">
          <iframe
            src="https://www.google.com/maps?q=이화여자대학교+교육관&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="공간정보연구실 위치 지도"
          />
        </div>
        <div className="sm:col-span-2">
          <Card>
            <p className="font-semibold text-ewha-green-900">공간정보연구실</p>
            <p className="mt-2 text-sm text-gray-500">
              주소: 03760 서울시 서대문구 이화여대길 52 (대현동) 교육관 A동 318호
            </p>
            <p className="mt-1 text-sm text-gray-500">Tel: 02-3277-2658</p>
            <p className="mt-1 text-sm text-gray-500">FAX: 02-3277-2659</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
