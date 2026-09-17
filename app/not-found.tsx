import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>문서를 찾을 수 없습니다.</h1>
      <p>아직 작성되지 않았거나 이름이 변경된 문서입니다.</p>
      <Link href="/">대문으로 돌아가기</Link>
    </div>
  );
}
