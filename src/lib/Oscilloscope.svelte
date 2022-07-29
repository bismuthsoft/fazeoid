<script lang="ts">
 export let waveData: number[] = [];
 export let gridrow: number;

 function generatePath (data: number[]) : string {
     const strs: string[] = [];
     data.forEach((d: number, i: number) => strs.push(
         `${i / (waveData.length - 1)},${d * 0.6}`
     ));
     return strs.join(' ');
 }
</script>

<div class="container" style:grid-area="{gridrow}/{1}">
    <svg class="scope" viewBox="0 -1 1 2" preserveAspectRatio="none">
        <polyline class="scopeLine" points="{generatePath(waveData)}"/>
    </svg>
</div>

<style>
 .container {
     height: 5rem;
     width: 8rem;
     outline: 2px solid black;
     align-self: center;
 }
 .scope {
     height: 100%;
     width: 100%;
 }
 .scopeLine {
     fill: none;
     stroke: black;
     stroke-width: 0.02px;
     stroke-linecap: round;
     stroke-linejoin: round;
 }
</style>
