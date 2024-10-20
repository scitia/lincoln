import { describe, it, expect } from "vitest";
import {Lincoln} from "../src/index.ts"
import { Mode } from "../src/enum/mode.enum.ts";

const lin = new Lincoln();

describe('Lincoln linear congruence equasions solver tests', () => {
    
    it('701x≡529 (mod 7) at boundary 20', () => {
        
        lin.construct(701, 529, 7);
        const solution = lin.atBoundary(20);

        expect(solution.ok).toBeTruthy();
        expect(solution.mode).toBe(Mode.BOUNDARY);
        expect(solution.result).toEqual(Array.of(4,11,18))
    });

    it('6x≡8 (mod 4) at boundary 12', () => {
        
        lin.construct(6, 8, 4);
        const solution = lin.atBoundary(12);

        expect(solution.ok).toBeTruthy();
        expect(solution.mode).toBe(Mode.BOUNDARY);
        expect(solution.result).toEqual(Array.of(0,2,4,6,8,10,12));
    });

    it('3x≡13 (mod 34) at boundary 6', () => {

        lin.construct(3, 8, 34);

        lin.lminus(4);
        lin.lplus(1);
        lin.rplus(6, 5)
        lin.rminus(9);

        const solution = lin.firstOnly();

        expect(solution.ok).toBeTruthy();
        expect(solution.mode).toBe(Mode.FIRST);
        expect(solution.result).toEqual(27);
    });
});