import { describe, it, expect, expectTypeOf } from "vitest";
import {Lincoln} from "../src/index.ts"
import { Mode } from "../src/enum/mode.enum.ts";

const lin = new Lincoln();

describe('Lincoln linear congruence equasions solver tests', () => {

    it('701x≡529 (mod 7) first 4', () => {
        
        lin.construct(701, 529, 7);
        const solution = lin.first(4);

        expect(solution.ok).toBeTruthy();
        expect(solution.mode).toBe(Mode.FIRST_N);
        expect(solution.result).toEqual(Array.of(4,11,18,25))
    });

    it('6x≡8 (mod 4)', () => {

        lin.construct(6,8,4);
        const solution = lin.first(6);

        expect(solution.ok).toBeTruthy();
        expect(solution.mode).toBe(Mode.FIRST_N);
        expect(solution.explanation).toBeUndefined();
        expect(solution.message).toBeUndefined();
        expect(solution.result).toEqual(Array.of(0,2,4,6,8,10));
    });
});