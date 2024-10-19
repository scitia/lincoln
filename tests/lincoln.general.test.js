import { describe, it, expect } from "vitest";
import {Lincoln} from "../src/index.ts"
import { Mode } from "../src/enum/mode.enum.ts";

describe('Lincoln linear congruence equasions solver tests', () => {
    it('2x≡4 (mod 6)', () => {
        const lin = new Lincoln();

        lin.slope(7);
        lin.congruent(5);
        lin.modulus(9);

        const solution = lin.general()

        const first = solution.result[0];
        const minimal_modulus = solution.result[1]; 

        expect(solution.ok).toBe(true);
        expect(solution.mode).toBe(Mode.GENERAL);
        expect(first).toBe(2);
        expect(minimal_modulus).toBe(9);
    });

    it('701x≡529 (mod 7)', () => {

        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.general();

        const first = solution.result[0];
        const minimal_modulus = solution.result[1]; 

        expect(solution.ok).toBe(true);
        expect(solution.mode).toBe(Mode.GENERAL);
        expect(first).toBe(4);
        expect(minimal_modulus).toBe(7);
    });
});