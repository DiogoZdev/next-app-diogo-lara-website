'use client'

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .top {
          height: 100px;
        }

        .bottom {
          height: 100px;
        }
      `}</style>

      <footer>
        <div className="top"></div>
        <div className="bottom gradient-bg"></div>
      </footer>
    </>
  );
}
