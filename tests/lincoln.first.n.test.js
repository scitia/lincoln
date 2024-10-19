import { describe, it, expect, expectTypeOf } from "vitest";
import {Lincoln} from "../src/index.ts"
import { Mode } from "../src/enum/mode.enum.ts";

describe('Lincoln linear congruence equasions solver tests', () => {

    it('701x≡529 (mod 7) first 4', () => {
        const lin = new Lincoln();
        lin.construct(701, 529, 7);
        const solution = lin.first(4);

        expect(solution.ok).toBe(true);
        expect(solution.mode).toBe(Mode.FIRST_N);
        expect(solution.result).toEqual(Array.of(4,11,18,25))
    });
});