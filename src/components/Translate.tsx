import { useLanguage } from "@/hooks/useLanguage";

export function Translate() {
    const { changeLanguage } = useLanguage()
    return <>

    <style jsx>{`
        .wrapper {
            width: 100px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2em;
        }

        span {
            cursor: pointer
        }
    `}</style>

    <div className="wrapper">
        <span onClick={() => changeLanguage("por")}>port</span>
        <span onClick={() => changeLanguage("eng")}>eng</span>
    </div>
    </>
}
