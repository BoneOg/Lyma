import React from 'react';

type PatternKeys =
  | 'wrapper'
  | 'carabao'
  | 'fish'
  | 'grapes'
  | 'shell'
  | 'lime'
  | 'jar'
  | 'bamboo'
  | 'coconut'
  | 'scallop'
  | 'leaf'
  | 'sugarcane'
  | 'logo'
  | 'carabao-mobile'
  | 'fish-mobile'
  | 'shell-mobile'
  | 'lime-mobile'
  | 'jar-mobile'
  | 'coconut-mobile'
  | 'scallop-mobile'
  | 'leaf-mobile'
  | 'sugarcane-mobile';

interface Props {
  overrides?: Partial<Record<PatternKeys, string>>;
}

const PatternBackground: React.FC<Props> = ({ overrides }) => {
  const cls = (key: PatternKeys, def: string) =>
    overrides?.[key] ? overrides![key]! : def;

  return (
    <div className={cls('wrapper', 'pointer-events-none select-none absolute inset-0 z-0')} aria-hidden="true">
      {/* Desktop Pattern Elements */}
      <img src="/assets/images/carabao_beige.webp" alt="" className={cls('carabao', 'hidden md:block absolute top-1/2 -translate-y-1/2 left-6 lg:left-12 w-32 lg:w-52 rotate-[-10deg]')} style={{ opacity: 0.08 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/fish_beige.webp" alt="" className={cls('fish', 'hidden md:block absolute top-[35%] right-4 lg:right-8 w-26 lg:w-64 rotate-[5deg] translate-x-32')} style={{ opacity: 0.07 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/grapes_beige.webp" alt="" className={cls('grapes', 'absolute bottom-0 left-2 lg:left-6 w-22 lg:w-36 rotate-[-1deg] -translate-x-4')} style={{ opacity: 0.06 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/shell_beige.webp" alt="" className={cls('shell', 'hidden lg:block absolute top-12 left-[28%] w-14 rotate-[6deg]')} style={{ opacity: 0.05 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/lime_beige.webp" alt="" className={cls('lime', 'hidden md:block absolute bottom-[15%] right- lg:right-75 w-12 lg:w-24 rotate-[10deg]')} style={{ opacity: 0.07 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/jar_beige.webp" alt="" className={cls('jar', 'hidden lg:block absolute top-[8%] right-[20%] w-14 xl:w-18 rotate-[-5deg]')} style={{ opacity: 0.045 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/bamboo_beige.webp" alt="" className={cls('bamboo', 'hidden xl:block absolute right-[25%] top-99 translate-x-12 w-22 rotate-[2deg]')} style={{ opacity: 0.045 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/coconut_beige.webp" alt="" className={cls('coconut', 'hidden lg:block absolute bottom-[2%] right-[40%] w-14 lg:w-18 rotate-[3deg]')} style={{ opacity: 0.04 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/scallop_beige.webp" alt="" className={cls('scallop', 'hidden md:block absolute bottom-[25%] left-[15%] w-11 lg:w-20 rotate-[-7deg]')} style={{ opacity: 0.035 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/leaf_beige.webp" alt="" className={cls('leaf', 'hidden xl:block absolute top-20 right-[40%] w-18 -rotate-2')} style={{ opacity: 0.035 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/sugarcane_beige.webp" alt="" className={cls('sugarcane', 'hidden md:block absolute top-40 left-0 w-14 lg:w-26 -rotate-5 translate-x-50')} style={{ opacity: 0.04 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/logo/lymaonly_beige.webp" alt="" className={cls('logo', 'absolute bottom-5 right-0 w-36 lg:w-52 rotate-[-6deg] translate-x-3 translate-y-3')} style={{ opacity: 0.035 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />

      {/* Mobile Pattern Elements - Better distributed across the viewport */}
      <img src="/assets/images/carabao_beige.webp" alt="" className={cls('carabao-mobile', 'block md:hidden absolute top-[8%] left-2 w-16 rotate-[-10deg]')} style={{ opacity: 0.12 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/fish_beige.webp" alt="" className={cls('fish-mobile', 'block md:hidden absolute top-[25%] right-1 w-20 rotate-[5deg]')} style={{ opacity: 0.10 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/shell_beige.webp" alt="" className={cls('shell-mobile', 'block md:hidden absolute top-[15%] right-[30%] w-12 rotate-[6deg]')} style={{ opacity: 0.08 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/lime_beige.webp" alt="" className={cls('lime-mobile', 'block md:hidden absolute top-[45%] left-[5%] w-10 rotate-[10deg]')} style={{ opacity: 0.09 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/jar_beige.webp" alt="" className={cls('jar-mobile', 'block md:hidden absolute top-[35%] right-[15%] w-12 rotate-[-5deg]')} style={{ opacity: 0.07 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/coconut_beige.webp" alt="" className={cls('coconut-mobile', 'block md:hidden absolute top-[60%] right-3 w-10 rotate-[3deg]')} style={{ opacity: 0.08 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/scallop_beige.webp" alt="" className={cls('scallop-mobile', 'block md:hidden absolute top-[75%] left-[20%] w-8 rotate-[-7deg]')} style={{ opacity: 0.06 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/leaf_beige.webp" alt="" className={cls('leaf-mobile', 'block md:hidden absolute top-[55%] left-[40%] w-12 -rotate-2')} style={{ opacity: 0.07 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      <img src="/assets/images/sugarcane_beige.webp" alt="" className={cls('sugarcane-mobile', 'block md:hidden absolute top-[85%] right-[25%] w-14 -rotate-5')} style={{ opacity: 0.06 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
    </div>
  );
};

export default PatternBackground;