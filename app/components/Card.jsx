import Tilt from 'react-parallax-tilt';

export default function Card({ title, description, onClick }) {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.18}
      glareColor="#1e90ff"
      glarePosition="all"
      scale={1.04}
      transitionSpeed={1200}
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      className="w-full"
    >
      <div
        className="bg-[#182848] p-6 rounded-lg shadow-lg text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e90ff]"
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
        aria-pressed={onClick ? false : undefined}
      >
        <h3 className="text-xl font-bold text-[#1e90ff] mb-2">{title}</h3>
        <p className="text-[#b3e0ff]">{description}</p>
      </div>
    </Tilt>
  );
}