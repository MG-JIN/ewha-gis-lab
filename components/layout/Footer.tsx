export default function Footer() {
  return (
    <footer className="border-t border-ewha-grey bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-gray-500">
        <p className="font-semibold text-ewha-green-900">
          Ewha GIS Lab <span className="font-normal text-gray-500">(공간정보연구실)</span>
        </p>
        <p className="mt-2">
          03760 서울특별시 서대문구 이화여대길 52 이화여자대학교 교육관 A동 318호
        </p>
        <p className="mt-1">Tel. 02-3277-2658 · FAX. 02-3277-2659</p>
        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Ewha GIS Lab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
