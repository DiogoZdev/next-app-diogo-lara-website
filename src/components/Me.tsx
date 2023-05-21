import Image from "next/image";

export const Me = () => (
  <>
    <style jsx>{`
      .me {
        padding: 5rem 0 0 0;
        width: 100%;
      }

      .me-bg {
        margin: 0 auto;
        width: 180px;
        height: 180px;
        position: relative;
        background-color: var(--layer-200);
        border-radius: 100%;
      }
    `}</style>

    <div className="me">
      <div className="me-bg">
        <Image
          className="me-image"
          src="diogo.svg"
          alt="Diogo Lara"
          width={200}
          height={200}
          style={{ filter: "hue-rotate(100deg)", position: "absolute", bottom: 0 }}
        />
      </div>
    </div>
  </>
);
