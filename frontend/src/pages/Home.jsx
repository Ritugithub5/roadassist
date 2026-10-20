import { useNavigate } from "react-router-dom";
import {
  FaCarBattery, FaTruckPickup, FaTools, FaGasPump, FaCarSide,
  FaShieldAlt, FaBolt, FaMapMarkedAlt, FaCheckCircle,
  FaArrowRight, FaCarCrash, FaUsers, FaThumbsUp,
} from "react-icons/fa";
import { MdOutlineTireRepair } from "react-icons/md";
import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import RotatingCar from "../components/RotatingCar";
import VeehoTile from "../components/VeehoTile";
import VeehoPhone from "../components/VeehoPhone";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    { id: "breakdown", icon: <FaTools />, title: "Breakdown Repair", description: "On-site engine & mechanical repair by certified pros.", price: "From ₹499" },
    { id: "towing", icon: <FaTruckPickup />, title: "Towing Service", description: "24/7 flatbed towing to your preferred garage.", price: "From ₹999", tag: "Popular" },
    { id: "battery", icon: <FaCarBattery />, title: "Battery Jump-Start", description: "Quick battery boost at your exact location.", price: "From ₹299" },
    { id: "tire", icon: <MdOutlineTireRepair />, title: "Flat Tire Repair", description: "Puncture fix or spare replacement on the spot.", price: "From ₹349" },
    { id: "fuel", icon: <FaGasPump />, title: "Fuel Delivery", description: "Petrol or diesel delivered safely to you.", price: "From ₹199" },
    { id: "inspection", icon: <FaCarSide />, title: "Vehicle Inspection", description: "Full 50-point checkup by certified mechanic.", price: "From ₹599" },
  ];

  const features = [
    { icon: <FaBolt />, title: "15-Min Response", desc: "Average arrival across 20+ cities." },
    { icon: <FaShieldAlt />, title: "Verified Partners", desc: "Every mechanic is background-checked." },
    { icon: <FaMapMarkedAlt />, title: "Live Tracking", desc: "Watch your mechanic arrive live." },
    { icon: <FaCheckCircle />, title: "Transparent Pricing", desc: "No hidden fees. Ever." },
  ];

  const steps = [
    { n: "01", icon: <FaCarCrash />, title: "Request Help", desc: "Tell us your issue and pin your location." },
    { n: "02", icon: <FaUsers />, title: "Get Matched", desc: "Nearby mechanics notified instantly." },
    { n: "03", icon: <FaMapMarkedAlt />, title: "Track Live", desc: "Watch your mechanic arrive on the map." },
    { n: "04", icon: <FaThumbsUp />, title: "Drive Away", desc: "Pay transparently and rate your experience." },
  ];

  const handleServiceClick = (serviceId) => {
    navigate(`/request-service?service=${serviceId}`);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-20 px-6 bg-gradient-to-br from-ink-900 via-ink-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-[0.15]" />
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-radial from-gold-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-radial from-gold-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — Text */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500/10 via-white/[0.03] to-transparent border border-gold-500/20 backdrop-blur-md mb-6">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-gold-100/90 tracking-[0.15em] uppercase">
                Live in 20+ cities · 24/7
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
              Stranded on the road?{" "}
              <span className="text-gold-shine">Help is 15 minutes away.</span>
            </h1>

            <div className="gold-underline w-24 mb-5" />

            <p className="text-base text-ink-400 leading-relaxed mb-8 max-w-lg">
              Verified mechanics, transparent pricing, and real-time tracking —
              all in one tap.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/request-service")}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-gold-300 to-gold-700 text-black font-semibold shadow-[0_8px_30px_-10px_rgba(232,182,45,0.6)] hover:shadow-[0_15px_40px_-10px_rgba(232,182,45,0.9)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Request Help
                <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/mechanics")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/40 text-gold-300 border border-gold-500/30 backdrop-blur-md hover:bg-black/60 hover:border-gold-500/60 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
              >
                Become a Partner
              </button>
            </div>
          </div>

          {/* RIGHT — Car (fixed overflow) */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <RotatingCar />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES BAR ================= */}
      <section className="relative -mt-8 z-10 px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl shadow-ink-900/10 border border-ink-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-ink-900 text-sm mb-0.5">{f.title}</h4>
                  <p className="text-xs text-ink-500 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHAT IS ROADASSIST ================= */}
      <section className="relative pt-16 pb-20 px-6 bg-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink-800 leading-tight mb-3">
              What is RoadAssist?
            </h2>
            <p className="text-sm text-ink-500 leading-relaxed max-w-md mx-auto">
              Built for everyone in the automotive ecosystem — from car owners
              to service providers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4 max-w-xs mx-auto w-full">
              <VeehoTile img="https://cdn.jsdelivr.net/gh/toine512/twemoji-bitmaps@main/128x128_png32/1f697.png" title="Car Service" delay={1} />
              <VeehoTile img="https://cdn.jsdelivr.net/gh/ehne/fluentui-twemoji-3d/export/3D_png/1f9fc.png" title="Car Wash & Care" delay={2} />
              <VeehoTile img="https://cdn.jsdelivr.net/gh/toine512/twemoji-bitmaps@main/128x128_png32/1f698.png" title="Pickup & Drop" delay={3} />
              <VeehoTile img="https://cdn-icons-png.flaticon.com/512/3097/3097182.png" title="Premium Care" delay={4} />
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative h-[280px] md:h-[320px]">
                <VeehoPhone />
              </div>
            </div>

            <div className="order-3 grid grid-cols-2 gap-4 max-w-xs mx-auto w-full">
              <VeehoTile img="https://em-content.zobj.net/source/microsoft-3D-fluent/406/headphone_1f3a7.png" title="Support Services" delay={5} />
              <VeehoTile img="https://em-content.zobj.net/source/microsoft-3D-fluent/406/delivery-truck_1f69a.png" title="Accessories" delay={6} />
              <VeehoTile img="https://em-content.zobj.net/source/microsoft-3D-fluent/406/stopwatch_23f1-fe0f.png" title="24/7 Support" delay={7} />
              <VeehoTile img="https://em-content.zobj.net/source/microsoft-3D-fluent/406/convenience-store_1f3ea.png" title="Verified Partners" delay={8} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL SERVICES ================= */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 overflow-hidden">
  <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-300/30 rounded-full blur-[120px] pointer-events-none" />
  <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[120px] pointer-events-none" />

  {/* Subtle dot pattern */}
  <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,120,60,0.15) 1px, transparent 0)`,
    backgroundSize: '32px 32px'
  }} />

  <div className="relative max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-amber-200">
          All Services
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 leading-tight mb-2">
          Pick a service,{" "}
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            get help in minutes.
          </span>
        </h2>
        <p className="text-sm text-warm-700">
          Transparent pricing. Verified partners. Real-time tracking.
        </p>
      </div>

      <div className="hidden md:flex gap-2">
        {["left", "right"].map((dir) => (
          <button
            key={dir}
            onClick={() =>
              document.getElementById("services-scroll")?.scrollBy({
                left: dir === "left" ? -420 : 420,
                behavior: "smooth",
              })
            }
            className="w-11 h-11 rounded-full border border-amber-200 bg-white hover:bg-amber-500 hover:border-amber-500 flex items-center justify-center text-warm-700 hover:text-white transition-all duration-300 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        ))}
      </div>
    </div>

    <div
      id="services-scroll"
      className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
    >
      {services.map((service) => (
        <article
          key={service.id}
          onClick={() => handleServiceClick(service.id)}
          className="group relative snap-start flex-shrink-0 w-[300px] md:w-[340px] rounded-2xl bg-white border border-amber-100 hover:border-amber-300 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden cursor-pointer hover:-translate-y-1"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/0 group-hover:bg-amber-400/20 rounded-full blur-3xl transition-all duration-700" />

          {service.tag && (
            <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white z-10 shadow-md">
              {service.tag}
            </span>
          )}

          <div className="relative flex items-start gap-3 p-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
              {service.icon}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base font-bold text-warm-900 leading-tight mb-1">
                {service.title}
              </h3>
              <p className="text-warm-700 text-xs leading-relaxed mb-3">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-cream-200">
                <span className="text-sm font-bold text-amber-700">
                  {service.price}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-warm-700">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative py-20 px-6 bg-ink-600 text-white overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <SectionHeading
            badge="How It Works"
            title="Help in 4 simple steps"
            subtitle="No phone calls. No haggling. Just fast, transparent help."
            theme="dark"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative glass-dark rounded-2xl p-6 border border-white/10 hover:border-brand-500/40 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-display text-4xl font-extrabold text-white/10">
                    {step.n}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-ink-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-ink-700 p-10 md:p-16 text-center">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Don't let a breakdown <br />
              <span className="gradient-text">ruin your day.</span>
            </h2>
            <p className="text-ink-300 mb-8 max-w-2xl mx-auto">
              Join 12,000+ drivers who trust RoadAssist for fast, reliable
              roadside help.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" onClick={() => navigate("/request-service")}>
                Get Roadside Assistance <FaArrowRight />
              </Button>
              <Button size="lg" variant="glass" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;