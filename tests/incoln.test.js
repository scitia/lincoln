import { describe, test, it, expect } from "vitest";
import {Lincoln} from "../src/index.ts"

describe('Lincoln linear congruence equasions solver tests', () => {
    it('2x≡4 (mod 6)', () => {
        const lin = new Lincoln();

        lin.slope(7);
        lin.congruent(5);
        lin.modulus(9);

        const solution = lin.general()

        const first = solution[0];
        const minimal_modulus = solution[1]; 

        expect(first).toBe(2);
        expect(minimal_modulus).toBe(9);
    });

    it('701x≡529 (mod 7)', () => {

        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.general();

        const first = solution[0];
        const minimal_modulus = solution[1]; 

        expect(first).toBe(4);
        expect(minimal_modulus).toBe(7);
    });

    it('701x≡529 (mod 7) at boundary 20', () => {
        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.atBoundary(20);

        expect(solution).toEqual(Array.of(4,11,18))
    });

    it('701x≡529 (mod 7) first 4', () => {
        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.first(4);

        expect(solution).toEqual(Array.of(4,11,18,25))
    });

    it('701x≡529 (mod 7) first only', () => {
        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.firstOnly();
        
        expect(solution).toBe(4);
    });
});