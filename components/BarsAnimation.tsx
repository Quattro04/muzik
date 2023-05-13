
export default function BarsAnimaiton({ className, width = 50, height = 50 }: { className?: string, width?: number, height?: number }) {

    return (
        <div
            className={`bars-animation now playing ${className}`}
            style={{ width, height }}
        >
            <span className="bar n1"></span>
            <span className="bar n2"></span>
            <span className="bar n3"></span>
            <span className="bar n4"></span>
        </div>
    )
}
