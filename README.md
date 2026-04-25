# 👟 Tennis 3D — Hand & Voice Controlled Sneaker Showroom

> An experimental WebGL playground built to push the limits of **real‑time hand gesture tracking** and **voice command recognition** directly in the browser — no native app, no plugins, no setup. Just open the page, allow camera and mic, and start playing.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r184-000?logo=three.js)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks%20Vision-4285F4?logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)

---

## ✨ What is this?

This project is a **portfolio experiment** — a fully interactive 3D sneaker showroom where the user can:

- 🤚 **Move their hands in front of the webcam** to rotate, zoom and inspect a 3D shoe in real time.
- 🎙️ **Speak out loud** to change the sneaker color (`"rosa"`, `"preto"`, `"marrom"`, `"original"` …).
- 🎨 Tune the on‑model color mask live, swap variants, and watch the scene react with smooth shader transitions.

The goal was to explore how far modern browser APIs — **WebGL, WebRTC, Web Speech, WASM** — have come, and prove that **AR‑style product experiences can ship as plain web pages**.

---

## 🧠 Core ideas being tested

| Capability | How it works |
|---|---|
| **Hand tracking** | [`@mediapipe/tasks-vision`](https://developers.google.com/mediapipe) runs the Hand Landmarker model on the user's webcam stream, returning 21 3D landmarks per hand at ~30fps. |
| **Gesture → 3D control** | Landmark positions are normalized and fed into a [Zustand](https://github.com/pmndrs/zustand) store, then consumed by a `HandZoomController` that drives the [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) camera (rotation + dolly zoom). |
| **Voice recognition** | The native [`SpeechRecognition`](https://developer.mozilla.org/docs/Web/API/SpeechRecognition) Web API listens continuously for short Portuguese keywords and maps them through a fuzzy matcher to a color variant. |
| **Live shader recoloring** | A custom GLSL shader on the GLTF sneaker performs a mask‑based recolor — body and accent colors blend in over 700ms via per‑material uniforms. |
| **Permission UX** | First‑class modals for camera/mic prompts, fallback states for `denied` / `unsupported`, and an always‑on camera preview so users can verify what's being captured. |

---

## 🕹️ Try it

```bash
# install
npm install   # or yarn / pnpm / bun

# run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and:

1. Allow **camera** access → wave your hand to rotate / zoom the sneaker.
2. Allow **microphone** access → say one of the supported color words.
3. Toggle hand mode and voice mode independently from the floating controls.

> 💡 Works best in **Chrome / Edge desktop**. Safari has partial Web Speech support; mobile browsers throttle camera frames.

---

## 🗣️ Voice command vocabulary

The recognizer is tuned for **PT‑BR** but accepts common EN synonyms:

| Variant | Spoken triggers |
|---|---|
| **Onyx** (black) | `preto`, `preta`, `escuro` |
| **Blush** (pink) | `rosa`, `pink`, `rose`, `rosinha` |
| **Cocoa** (brown) | `marrom`, `café`, `chocolate` |
| **Original** | `original`, `padrão`, `default`, `normal` |

Add more in [`lib/voiceCommands.ts`](lib/voiceCommands.ts).

---

## 🏗️ Project structure

```
app/                    # Next.js 16 App Router entrypoint
components/
  scene/
    Tenis/              # GLTF sneaker + custom recolor shader
    TenisScene/         # R3F canvas, lighting, hand‑driven camera
  ui/
    CameraPreview/      # Live webcam feed in the corner
    HandModeToggle/     # Toggle hand tracking on/off
    VoiceToggle/        # Toggle speech recognition on/off
    HandStatusBadges/   # Real‑time gesture status indicators
    MaskTuningPanel/    # Dev panel to tweak the recolor mask
    ProductPanel/       # Right‑side product info + variants
hooks/
  useHandTracking.ts    # MediaPipe wiring + landmark dispatch
  useCameraStream.ts    # getUserMedia lifecycle
  useVoiceRecognition.ts# Web Speech API listener
lib/
  handStore.ts          # Zustand store: hands, permissions, modes
  colors.ts             # Sneaker variants definition
  voiceCommands.ts      # Spoken word → variant mapping
  voiceMatcher.ts       # Fuzzy matching for noisy transcripts
```

---

## 🔬 Tech stack

- **[Next.js 16](https://nextjs.org/)** + **React 19** (App Router, RSC where it makes sense)
- **[Three.js r184](https://threejs.org/)** + **[@react-three/fiber](https://github.com/pmndrs/react-three-fiber)** + **[@react-three/drei](https://github.com/pmndrs/drei)**
- **[@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision)** for hand landmark detection (WASM + WebGL backend)
- **Web Speech API** for voice recognition (no cloud calls)
- **[Zustand](https://github.com/pmndrs/zustand)** for cross‑component reactive state
- **TailwindCSS 4** for layout & overlays
- **TypeScript 5**

---

## 🎯 Why build this?

To validate three hypotheses:

1. **Hands as input** — can webcam‑based hand tracking feel responsive enough for product exploration UI? (Answer: yes, with smoothing.)
2. **Voice as a secondary modality** — does speech work as a low‑friction shortcut on top of touch/mouse? (Answer: surprisingly well for short closed vocabularies.)
3. **Pure‑web AR** — how close can we get to native AR ergonomics with only browser APIs? (Answer: closer every year.)

This codebase is a sandbox for those questions, and a foundation for richer experiments — gesture menus, two‑hand manipulation, multi‑object scenes, multilingual voice models, etc.

---

## 📜 License

MIT — fork it, break it, build something weirder on top of it.
