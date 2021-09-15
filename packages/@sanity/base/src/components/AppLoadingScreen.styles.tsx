import styled, {keyframes} from 'styled-components'

const bottomKeyframes = keyframes`
0%,
85% {
    stroke-dashoffset: 265;
    opacity: 0;
}
15%,
64% {
    stroke-dashoffset: 175;
    opacity: 0.5;
}
`

const middleKeyframes = keyframes`
11%,
75% {
    stroke-dashoffset: 100;
    opacity: 0;
}
15% {
    opacity: 1;
}
25%,
63% {
    stroke-dashoffset: 225;
    opacity: 1;
}
`

const topKeyframes = keyframes`
22%,
70% {
  opacity: 0;
  stroke-dashoffset: 226;
}
25% {
  opacity: 0.5;
}
35%,
54% {
  stroke-dashoffset: 149;
  opacity: 0.5;
}
`

export const FillShape = styled.path`
stroke-width: 40;
stroke: #F03E2F;
opacity: 0;

&[data-placement="bottom"] {
    stroke-dasharray: 90;
    stroke-dashoffset: 85;
    animation: ${bottomKeyframes} var(--time) ease-in infinite;
}
&[data-placement="middle"] {
    stroke-dasharray: 115;
    stroke-dashoffset: 110;
    animation: ${middleKeyframes} var(--time) linear infinite;
}
&[data-placement="top"] {
    stroke-dasharray: 77;
    stroke-dashoffset: 72;
    animation: ${topKeyframes} var(--time) ease-out infinite;
}
`

const pulseAnim = keyframes`
from {
    transform: scale3d(0.75, 0.75, 0.75);
}

50% {
    transform: scale3d(1, 1, 1);
}

to {
    transform: scale3d(0.75, 0.75, 0.75);
}
`

export const LoaderWrapper = styled.div`
display: block;
animation: ${pulseAnim} var(--time) cubic-bezier(.11,0,.27,1) infinite;
--time: 3s;
` 