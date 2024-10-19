import { describe, it, expect } from "vitest";
import {Lincoln} from "../src/index.ts"

describe('Lincoln linear congruence equasions solver tests', () => {
    
    it('701x≡529 (mod 7) at boundary 20', () => {
        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.atBoundary(20);

        expect(solution).toEqual(Array.of(4,11,18))
    });
});