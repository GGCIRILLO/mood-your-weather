import {View, Text} from "react-native"
import{useMemo} from "react"
import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Path,
    Circle,
    G,
    Line,
    Text as SvgText,
} from "react-native-svg"
import {
    eachDayOfInterval,
    endOfDay,
    format,
    startOfDay,
    subDays,
    isSameDay,
} from "date-fns";
import { it } from "date-fns/locale";
import type { MoodEntry } from "@/types";

type Props = {
        moods: MoodEntry[];
        height?: number;
        cardClassName?: string;
        weatherTypeToEmoji?: Record<string, string>;
        title?: string;
        subtitle?: string
    }

type DayPoint = {
    date: Date;
    label: string;
    value: number | null;
    emoji: string;
    }

const DEFAULT_EMOJI = "☁️"

const SENTIMENT_MAP: Record<string, number> = {
      "☀️": 1.0,
      "⛅": 0.5,
      "☁️": 0.0,
      "🌧️": -0.5,
      "⛈️": -0.8,
      "🌈": 0.9,
      "🌙": 0.3,
      "⚡": 0.6,
      "❄️": -0.3,
      "🌪️": -0.9,
    };

function clamp(n:number, min: number, max: number){
        return Math.max(min, Math.min(max,n));
    }

function sentimentFromEntry(entry:MoodEntry, weatherTypeToEmoji?: Record<string, string>){
    const emojiList = entry.emojis.map((wt:any) => {
        const e = weatherTypeToEmoji?.[String(wt)];
        return e ?? String(wt);
        })

    const total = emojiList.reduce((acc, emoji) => acc + (SENTIMENT_MAP[emoji] ?? 0), 0);
    const avg = emojiList.length ? total / emojiList.length : 0;
    return clamp(avg, -1, 1);
    }

function pickFirstEmoji(entry: MoodEntry, weatherTypeToEmoji?: Record<string, string>){
    const first = entry.emojis?.[0];
    if(!first) return DEFAULT_EMOJI;
    return weatherTypeToEmoji?.[String(first)] ?? String(first) ?? DEFAULT_EMOJI;
    }

// Calcola il sentiment medio da una lista di entry (per quando ci sono più mood nello stesso giorno)
function sentimentFromEntries(entries: MoodEntry[], weatherTypeToEmoji?: Record<string, string>): number {
    if (entries.length === 0) return 0;

    // Raccogli tutti gli emoji di tutte le entry
    const allEmojis = entries.flatMap(entry => entry.emojis);

    // Mappa i tipi di weather agli emoji
    const mappedEmojis = allEmojis.map((wt: any) => {
        const e = weatherTypeToEmoji?.[String(wt)];
        return e ?? String(wt);
    });

    // Calcola il sentiment medio
    const total = mappedEmojis.reduce((acc, emoji) => acc + (SENTIMENT_MAP[emoji] ?? 0), 0);
    const avg = mappedEmojis.length ? total / mappedEmojis.length : 0;
    return clamp(avg, -1, 1);
}

// Trova l'emoji più vicina al sentiment value
function findClosestEmoji(sentiment: number): string {
  let closest = "☁️";
  let minDist = Infinity;

  for (const [emoji, emojiSentiment] of Object.entries(SENTIMENT_MAP)) {
    const dist = Math.abs(emojiSentiment - sentiment);
    if (dist < minDist) {
      minDist = dist;
      closest = emoji;
    }
  }

  return closest;
}

function smoothCurve(points: {x:number, y:number}[], tension = 0.5){
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i=0; i< points.length -1; i++){
        const p0 = points[i-1] ?? points[0];
        const p1 = points[i];
        const p2 = points[i+1];
        const p3 = points[i+2] ?? points[i+1];

        const c1x = p1.x + ((p2.x - p0.x) * tension) / 6;
        const c1y = p1.y + ((p2.y - p0.y) * tension) / 6;
        const c2x = p2.x - ((p3.x - p1.x) * tension) / 6;
        const c2y = p2.y - ((p3.y - p1.y) * tension) / 6;

        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
        }

    return d;
    }

export default function WeeklyMoodChart({
    moods,
    height = 220,
    cardClassName = "bg-white rounded-3xl p-6 shadow-lg",
    weatherTypeToEmoji,
    title = "last 7 days trend",
    subtitle = "Emotional Fluctuations",
    }: Props){
        // Debug logs
        console.log("📊 [WEEKLY_CHART] Moods ricevuti:", moods.length);
        if (moods.length > 0) {
            console.log("📊 [WEEKLY_CHART] Primi 3 moods:", moods.slice(0, 3).map(m => ({
                timestamp: m.timestamp,
                emojis: m.emojis
            })));
        }

        const data = useMemo<DayPoint[]>(() =>{
            const end = endOfDay(new Date());
            const start = startOfDay(subDays(end,6));
            const days = eachDayOfInterval({start, end});
            console.log("📊 [WEEKLY_CHART] Giorni da analizzare:", days.map(d => format(d, "yyyy-MM-dd")));

            return days.map((day)=>{
                const dayEntries = moods
                    .filter((m) => isSameDay(new Date(m.timestamp), day))
                    .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                if (dayEntries.length > 0) {
                    const allEmojis = dayEntries.flatMap(e => e.emojis).join(", ");
                    console.log(`📊 [DAY] ${format(day, "yyyy-MM-dd")}: ${dayEntries.length} entries - Emojis: ${allEmojis}`);
                }

                // Calcola il sentiment medio di TUTTI i mood del giorno
                const sentimentValue = dayEntries.length > 0 ? sentimentFromEntries(dayEntries, weatherTypeToEmoji) : null;

                // Scegli l'emoji più rappresentativa del sentiment medio
                let displayEmoji = "·";
                if (sentimentValue !== null) {
                    displayEmoji = findClosestEmoji(sentimentValue);
                }

                return{
                    date: day,
                    label: format(day, "d MMM", {locale: it}),
                    value: sentimentValue,
                    emoji: displayEmoji,
                };
            });
        },[moods, weatherTypeToEmoji]);

    const W = 320;
    const H = height;
    const PAD_L = 40;
    const PAD_R = 18;
    const PAD_T = 22;
    const PAD_B = 44;

    const innerW = W-PAD_L-PAD_R;
    const innerH = H-PAD_B - PAD_T;

    // X-axis: giorni della settimana (orizzontale)
    const xIndex = (i:number)=> PAD_L + (innerW * i)/Math.max(1,data.length -1);

    // Y-axis: positività del mood (verticale) - alto=positivo, basso=negativo
    const yValue = (v:number)=>{
        // v va da -1 (negativo) a 1 (positivo)
        // Invertiamo: quando v=1 (positivo) -> y=PAD_T (alto), quando v=-1 (negativo) -> y=PAD_T+innerH (basso)
        const normalized = (v + 1) / 2; // Normalizza da [0, 1]
        return PAD_T + innerH * (1 - normalized); // Inverte: alto per positivo
    };

    const filledValues = useMemo(()=> {
        const vals = data.map((d)=>d.value);
        const res = vals.slice();
        for(let i = 0; i<res.length; i++){
            if(res[i]!==null)continue;
            let left: number | null = null;
            for(let j = i-1; j>=0; j-- ){
                if(res[j] !== null){
                    left = res[j];break;
                }
            }

            let right: number| null = null;
            for(let j = i+1; j<res.length; j++){
                if(res[j] !== null){
                    right = res[j];
                    break;
                }
            }

            if(left !== null && right !== null)res[i] = (left + right)/2;
            else  if(left !== null) res[i] = left;
            else if(right !== null) res[i] = right;
            else res[i] = 0;
        }

        return res as number[];
    }, [data]);

    const points = useMemo(()=>{
            return filledValues.map((v, i)=>({
                x: xIndex(i),
                y: yValue(v),
                }));
        },[filledValues, data.length]);

    const linePath = useMemo(()=> smoothCurve(points), [points]);

    const areaPath = useMemo(()=>{
        if(!linePath) return "";
        const last = points[points.length -1];
        const first = points[0];
        const baselineY = PAD_T + innerH;
        return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;;
        }, [linePath, points]);

    const midlineY = yValue(0);

    return (
        <View className={cardClassName}>
            {/*Mood chart*/}
            <Text className="text-gray-400 text-sm mb-1">{subtitle}</Text>
            <Text className="text-gray-900 text-xl font-bold mb-4">{title}</Text>

            <View style = {{width : "100%"}}>
                <Svg
                    width ="100%"
                    height = {H}
                    viewBox={`0 0 ${W} ${H}`}
                >
                    <Defs>
                        <LinearGradient id="fillGlow" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset = "0%" stopColor="#2F6BFF" stopOpacity={0.22}/>
                            <Stop offset = "60%" stopColor="#2F6BFF" stopOpacity={0.08}/>
                            <Stop offset = "100%" stopColor="#2F6BFF" stopOpacity={0}/>
                        </LinearGradient>
                    </Defs>

                    {/* Y-axis labels - Positività */}
                    <SvgText
                        x={15}
                        y={PAD_T + 10}
                        fontSize={9}
                        fill="rgba(255,255,255,0.6)"
                        textAnchor="middle"
                    >
                        +1
                    </SvgText>
                    <SvgText
                        x={15}
                        y={PAD_T + innerH/2 + 10}
                        fontSize={9}
                        fill="rgba(255,255,255,0.6)"
                        textAnchor="middle"
                    >
                        0
                    </SvgText>
                    <SvgText
                        x={15}
                        y={PAD_T + innerH + 10}
                        fontSize={9}
                        fill="rgba(255,255,255,0.6)"
                        textAnchor="middle"
                    >
                        -1
                    </SvgText>

                    <Line
                        x1={PAD_L}
                        y1={midlineY}
                        x2={W - PAD_R}
                        y2={midlineY}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={1}
                    />

                    {/* Fill area under the curve */}
                    <Path
                        d={areaPath}
                        fill="url(#fillGlow)"
                        stroke="none"
                    />

                     <Path
                        d={linePath}
                        fill="none"
                        stroke="rgba(47,107,255,0.18)"
                        strokeWidth={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />

                     <Path
                       d={linePath}
                       fill="none"
                       stroke="rgba(47,107,255,0.22)"
                       strokeWidth={6}
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     />

                     <Path
                       d={linePath}
                       fill="none"
                       stroke="#2F6BFF"
                       strokeWidth={3.5}
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     />

                     <G>
                       {data.map((d, i) => {
                           const x = xIndex(i);
                           const y = yValue(filledValues[i]);

                           const chipR = 18;
                           const ringR = 19.5;

                           return (
                                <G key={d.label}>
                                    <Circle
                                        cx={x}
                                        cy={y}
                                        r={ringR}
                                        fill="rgba(0,0,0,0.35)"
                                    />
                                    <Circle
                                        cx={x}
                                        cy={y}
                                        r={chipR}
                                        fill="rgba(10,16,28,0.85)"
                                        stroke="rgba(47,107,255,0.55)"
                                        strokeWidth={1.4}
                                    />
                                    <SvgText
                                        x={x}
                                        y={y + 6}
                                        fontSize={18}
                                        textAnchor="middle"
                                    >
                                        {d.emoji}
                                    </SvgText>
                                </G>
                                );
                       })}
                     </G>

                     <G>
                        {/* X-axis labels - Giorni della settimana */}
                        {data.map((d,i)=>{
                            const x = xIndex(i);
                            return(
                                <SvgText
                                    key={`lbl-${d.label}`}
                                    x={x}
                                    y={H-16}
                                    fontSize = {11}
                                    fill = "rgba(255,255,255,0.55)"
                                    textAnchor = "middle"
                                >
                                {format(d.date, "EEE", {locale: it}).toUpperCase()}
                                </SvgText>
                                );
                            })}
                     </G>
                </Svg>
            </View>
        </View>
    );
}




