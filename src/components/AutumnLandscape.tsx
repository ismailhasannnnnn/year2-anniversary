interface AutumnLandscapeProps {
  answers: number;
  travelling?: boolean;
}

/** Layered scrapbook landscape. Each answer reveals one piece of the memory. */
export function AutumnLandscape({ answers, travelling = false }: AutumnLandscapeProps) {
  return (
    <svg className={`autumn-landscape ${travelling ? 'car-travelling' : ''}`} viewBox="0 0 1000 520" role="img" aria-label={`the drive mom and dad took: ${answers >= 1 ? 'fall foliage' : 'bare trees'}, ${answers >= 2 ? 'white mountains' : 'a blank mountain horizon'}, ${answers >= 3 ? 'mom and dad in the car' : 'a little car'}`}>
      <path fill="#dbe1d7" d="M0 0h1000v520H0z" />
      <circle cx="745" cy="96" r="47" fill="#f4e3b5" />
      <g className={answers >= 2 ? 'landscape-layer revealed' : 'landscape-layer'}>
        <path d="m-50 300 230-226 164 145L510 44l190 196L849 97l219 218Z" fill="#a7b3aa" />
        <path d="m180 74 164 145-79-27Zm330-30 190 196-125-67ZM849 97l219 218-144-71Z" fill="#8b9e96" />
        <path d="m464 92 46-48 48 50-31-12-17 9-13-15Z" fill="#e9e9d8" />
      </g>
      <path d="M0 255q200-70 423 25t577-37v277H0Z" fill="#b9ba8a" />
      <path d="M0 363q244-133 510-24t490-10v191H0Z" fill="#b49265" />
      <path d="M500 267c-225 59 270 86 100 150S201 462 197 542" stroke="#f6e5c4" strokeWidth="69" fill="none" />
      <path d="M500 267c-225 59 270 86 100 150S201 462 197 542" stroke="#8c8170" strokeWidth="52" fill="none" />
      <path d="M500 267c-225 59 270 86 100 150S201 462 197 542" stroke="#e6d3af" strokeWidth="2" strokeDasharray="12 14" fill="none" />
      {[90, 225, 790, 915, 665].map((x, index) => (
        <g key={x} transform={`translate(${x} ${index % 2 ? 235 : 285})`}>
          <path d="M0 70V-53m0 42-25-20M0 12l28-28" stroke="#816344" strokeWidth="8" strokeLinecap="round" fill="none" />
          <g className={answers >= 1 ? 'landscape-layer revealed' : 'landscape-layer'} style={{ transitionDelay: `${index * 75}ms` }}>
            <ellipse cy="-40" rx="48" ry="67" fill={['#bc6744', '#d8a254', '#d29542', '#9e5141', '#c88442'][index]} />
            <path d="M0 42v-85m0 21-20-15M0 6l23-20" stroke="#865f3e" strokeWidth="3" fill="none" opacity=".6" />
          </g>
        </g>
      ))}
      <g className="drive-car-position">
        <g className="drive-car">
          <ellipse cx="500" cy="395" rx="70" ry="8" fill="#5d504030" />
          <path d="m450 360 20-31h54l25 31 15 8v20H437v-20Z" fill="#ded3b7" stroke="#766e5c" strokeWidth="3" />
          <path d="m459 358 15-22h46l20 22Z" fill="#b8cdc8" stroke="#766e5c" strokeWidth="2" />
          <g className={answers >= 3 ? 'landscape-layer revealed' : 'landscape-layer'}>
            <circle cx="485" cy="345" r="7" fill="#c6a080" /><path d="M477 358q1-12 16-1" fill="#8d6150" />
            <circle cx="513" cy="345" r="7" fill="#d6af8c" /><path d="M505 358q1-12 16-1" fill="#8d9475" />
          </g>
          <circle cx="461" cy="386" r="13" fill="#53554c" /><circle cx="540" cy="386" r="13" fill="#53554c" />
          <circle cx="461" cy="386" r="5" fill="#b9b2a0" /><circle cx="540" cy="386" r="5" fill="#b9b2a0" />
          <path d="M500 335v25" stroke="#766e5c" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

export function ChoiceDrawing({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
      {kind === 'leaf' && <><path d="m40 7 7 15 15-3-7 14 8 8-19 3-5 10-5-10-18-3 8-8-7-14 16 3Z" fill="#bf7748" /><path d="M39 53V24" stroke="#86563e" strokeWidth="2" /></>}
      {kind === 'flower' && <><path d="M40 50V24" stroke="#879574" strokeWidth="3" /><path d="M40 19c-20-25-26 11-8 12-19 17 15 28 15 9 24 7 23-23 5-17 7-22-16-23-12-4" fill="#ce9b97" /><circle cx="41" cy="30" r="7" fill="#e6c885" /></>}
      {kind === 'snow' && <path d="M40 5v50M18 16l44 28M18 44l44-28m-28-4 6 7 6-7m-12 36 6-7 6 7" stroke="#8ca6a9" strokeWidth="3" strokeLinecap="round" />}
      {kind === 'mountain' && <><path d="m8 50 22-36 15 20L57 9l21 41Z" fill="#8e9d8c" /><path d="m47 29 10-20 10 20-10-5Z" fill="#ede9d8" /></>}
      {kind === 'wave' && <path d="M8 24q8-12 16 0t16 0 16 0 16 0M8 40q8-12 16 0t16 0 16 0 16 0" stroke="#8ca6a9" strokeWidth="4" />}
      {kind === 'city' && <path d="M10 50V25h16v25m0 0V10h22v40m0 0V20h20v30M32 19h10m-10 9h10m-10 9h10" stroke="#a68c75" strokeWidth="4" />}
      {/^[123]$/.test(kind) && <><rect x="19" y="8" width="42" height="44" rx="3" fill="#eee1ca" stroke="#ae967b" /><path d="M19 20h42" stroke="#ae967b" /><text x="40" y="44" textAnchor="middle" fontFamily="Georgia" fontSize="23" fill="#a85848">{kind}</text></>}
    </svg>
  );
}
