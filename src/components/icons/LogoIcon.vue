<script setup lang="ts"></script>

<template>
    <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gold_gradient" x1="128" y1="20" x2="128" y2="230" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#fec66a" />
                <stop offset="50%" stop-color="#f3c355" />
                <stop offset="100%" stop-color="#e0a93e" />
            </linearGradient>

            <filter id="soft_drop_shadow" x="-20" y="-20" width="300" height="300" filterUnits="userSpaceOnUse">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                <feOffset dx="0" dy="6"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <g filter="url(#soft_drop_shadow)">
            <path d="M30 65 C 30 35, 85 35, 100 70 L 128 130 L 156 70 C 171 35, 226 35, 226 65 C 226 85, 190 130, 160 185 C 150 205, 106 205, 96 185 C 66 130, 30 85, 30 65 Z"
                fill="url(#gold_gradient)"
                stroke="#e9b853"
                stroke-width="10"/>

            <path d="M50 75 C 50 55, 90 55, 105 80 L 128 140 L 151 80 C 166 55, 206 55, 206 75 C 206 90, 175 125, 150 170 C 145 180, 111 180, 106 170 C 81 125, 50 90, 50 75 Z"
                fill="#FFFFFF"
                fill-opacity="0.25"/>
        </g>

        <!-- <g>
            <circle cx="65" cy="75" r="34" fill="#9cadf2" opacity="0.95"/>

            <circle cx="195" cy="110" r="22" fill="#fe7a77" opacity="0.95"/>

            <circle cx="128" cy="165" r="14" fill="#94e6c8" opacity="0.95"/>
        </g> -->
    </svg>
</template>

<style scoped></style>
