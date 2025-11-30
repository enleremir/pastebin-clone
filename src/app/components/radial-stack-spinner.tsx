"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { OrbitControls, OrthographicCamera, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const START_DELAY = 0.5;
const PANEL_COUNT = 9;
const OPEN_DURATION = 2;
const CARD_LENGTH = 4;
const CARD_HEIGHT = 4;
const CARD_THICKNESS = 0.025;
const SPIN_SPEED = 0.3;

type Token = { text: string; color: string };
type CodeLine = Token[];

const COL_COMMENT = "#52E8FF";
const COL_KEYWORD = "#52E8FF";
const COL_FUNC = "#FC68ED";
const COL_DEFAULT = "#F5F5F5";
const COL_STRING = "#F5F5F5";

const SNIPPET = `//SECURE & PRIVATE

IMPORT CSV
IMPORT JSON

DEF
PARSE_CSV_TO_JSON(FILENAME):
      """CONVERT CSV FILE TO
JSON FORMAT"""
      DATA = []
      WITH OPEN(FILENAME, 'R')
AS FILE:
        CSV_READER =
CSV.DICTREADER(FILE)
        FOR ROW IN CSV_READER:
          DATA.APPEND(ROW)
`;

const KEYWORDS = new Set([
  "DEF",
  "RETURN",
  "IMPORT",
  "WITH",
  "AS",
  "FOR",
  "IN",
  "CLASS",
  "IF",
  "ELSE",
  "ELIF",
  "FROM",
]);

const FUNCTION_NAMES = new Set(["PARSE_CSV_TO_JSON"]);

function tokenizeCode(src: string): CodeLine[] {
  const lines = src.replace(/\t/g, "    ").split("\n");

  return lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
      return [{ text: line, color: COL_COMMENT }];
    }

    const parts = line.split(/(\s+|\(|\)|:|,)/g).filter(Boolean);
    if (!parts.length) return [{ text: "", color: COL_DEFAULT }];

    const tokens: Token[] = [];

    for (const raw of parts) {
      const upper = raw.toUpperCase();

      if (/^\s+$/.test(raw)) {
        tokens.push({ text: raw, color: COL_DEFAULT });
      } else if (/^["'].*["']$/.test(raw)) {
        tokens.push({ text: raw, color: COL_STRING });
      } else if (FUNCTION_NAMES.has(upper)) {
        tokens.push({ text: raw, color: COL_FUNC });
      } else if (KEYWORDS.has(upper)) {
        tokens.push({ text: raw, color: COL_KEYWORD });
      } else {
        tokens.push({ text: raw, color: COL_DEFAULT });
      }
    }

    return tokens;
  });
}

const TOKENIZED_LINES = tokenizeCode(SNIPPET);

const CODE_FONT_SIZE = 0.15;
const CODE_LINE_HEIGHT = 1.25;
const CODE_CHAR_WIDTH = CODE_FONT_SIZE * 0.6;
const CODE_WIDTH = CARD_LENGTH * 0.8;
const CODE_HEIGHT = CARD_HEIGHT * 0.9;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface PanelProps {
  index: number;
  total: number;
}

function Panel({ index, total }: PanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startRef = useRef<number | null>(null);

  useFrame((state) => {
    if (startRef.current === null) {
      startRef.current = state.clock.getElapsedTime();
    }

    const localTime = state.clock.getElapsedTime() - startRef.current;
    const t = localTime - START_DELAY;
    if (t < 0) return;

    const progress = easeOutCubic(Math.min(t / OPEN_DURATION, 1));
    const normalized = index / total;
    const angle = normalized * Math.PI * 2 * progress;

    if (groupRef.current) {
      groupRef.current.rotation.x = angle;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -(CARD_HEIGHT / 1.75)]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[CARD_LENGTH, CARD_HEIGHT, CARD_THICKNESS]} />
        <meshPhysicalMaterial
          color="#252222"
          roughness={0.85}
          metalness={0.9}
          clearcoat={0.5}
          clearcoatRoughness={2}
          reflectivity={0.8}
          envMapIntensity={1.5}
        />

        {TOKENIZED_LINES.map((lineTokens, lineIndex) => {
          const y = CODE_HEIGHT / 2 - 0.35 - lineIndex * (CODE_FONT_SIZE * CODE_LINE_HEIGHT);
          const baseZ = CARD_THICKNESS / 2 + 0.02;
          let cursorX = -CODE_WIDTH / 2 + 0.2;

          return (
            <group key={lineIndex}>
              {lineTokens.map((token, tokenIndex) => {
                const x = cursorX;
                cursorX += token.text.length * CODE_CHAR_WIDTH;

                return (
                  <Text
                    key={tokenIndex}
                    font="/fonts/FragmentMono-Regular.ttf"
                    position={[x, y, baseZ]}
                    fontSize={CODE_FONT_SIZE}
                    anchorX="left"
                    anchorY="top"
                    color={token.color}
                  >
                    {token.text}
                  </Text>
                );
              })}
            </group>
          );
        })}
      </mesh>
    </group>
  );
}

function RadialStack() {
  const groupRef = useRef<THREE.Group>(null);
  const startRef = useRef<number | null>(null);

  useFrame((state) => {
    if (startRef.current === null) {
      startRef.current = state.clock.getElapsedTime();
    }

    const localTime = state.clock.getElapsedTime() - startRef.current;
    const t = localTime - START_DELAY;
    if (t < 0) return;

    const spinAngle = t * SPIN_SPEED;

    if (groupRef.current) {
      groupRef.current.rotation.set(spinAngle, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: PANEL_COUNT }).map((_, i) => (
        <Panel key={i} index={i} total={PANEL_COUNT} />
      ))}
    </group>
  );
}

interface FitOrthographicCameraProps {
  margin?: number;
}

function FitOrthographicCamera({ margin = 1.1 }: FitOrthographicCameraProps) {
  const { camera, size } = useThree();
  const startTimeRef = useRef<number | null>(null);

  const fit = () => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const fitHeight = CARD_HEIGHT * 2 + CARD_HEIGHT / 1.75;
    const zoomForHeight = size.height / (fitHeight * margin);

    camera.zoom = zoomForHeight;
    camera.updateProjectionMatrix();
  };

  useLayoutEffect(() => {
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, margin]);

  useFrame((state) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    if (elapsed < 3) {
      fit();
    }
  });

  return null;
}

function LineLoader() {
  const barRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const span = 1;
    const phase = (t * 0.8) % 2;
    const x = THREE.MathUtils.lerp(-span, span, phase <= 1 ? phase : 2 - phase);

    if (barRef.current) {
      barRef.current.position.x = x;
    }
  });

  return (
    <>
      <color attach="background" args={["#f5f5f5"]} />
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={140} />

      <mesh>
        <planeGeometry args={[3, 0.01]} />
        <meshBasicMaterial color="#eaeaea" />
      </mesh>

      <mesh ref={barRef} position={[0, 0, 0.001]}>
        <planeGeometry args={[1, 0.01]} />
        <meshBasicMaterial color="#252222" />
      </mesh>
    </>
  );
}

function RadialScene() {
  const stackRef = useRef<THREE.Group>(null);

  return (
    <>
      <OrthographicCamera makeDefault position={[5, 0, 8]} zoom={120} near={0.01} far={200} />
      <FitOrthographicCamera margin={1.1} />
      <color attach="background" args={["#f5f5f5"]} />

      <ambientLight intensity={1} />

      <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>

      <directionalLight
        position={[20, 20, 20]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-20, 20, -10]} intensity={2} />

      <group ref={stackRef}>
        <RadialStack />
      </group>

      <OrbitControls enablePan={false} />
    </>
  );
}

export function RadialStackSpinner() {
  return (
    <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
      <Suspense fallback={<LineLoader />}>
        <RadialScene />
      </Suspense>
    </Canvas>
  );
}
