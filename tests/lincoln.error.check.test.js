import { describe, it, expect } from "vitest";
import { FailCouse, FailCouseMessage, Lincoln } from "../src/index.ts"
import { Mode } from "../src/enum/mode.enum.ts";

const lin = new Lincoln();

describe('Lincoln - linear congruence without solution', () => {

    it('6x≡1 (mod 33) should return no solution error', () => {

        lin.construct(6, 1, 33);
        const result = lin.general();

        expect(result.ok).toBeFalsy();
        expect(result.mode).toBe(Mode.GENERAL);
        expect(result.explanation).toBe(FailCouse.SOLUTION_NOT_EXIST);
        expect(result.message).toBe(FailCouseMessage.M_SOLUTION_NOT_EXIST);
        expect(result.result).toBeUndefined();
    });

    it('6x≡3 (mod 4) should return no solution error', () => {

        lin.construct(6, 3, 4);
        const result = lin.general();

        expect(result.ok).toBeFalsy();
        expect(result.mode).toBe(Mode.GENERAL);
        expect(result.explanation).toBe(FailCouse.SOLUTION_NOT_EXIST);
        expect(result.message).toBe(FailCouseMessage.M_SOLUTION_NOT_EXIST);
        expect(result.result).toBeUndefined();
    });
});

describe('Lincoln - linear congruence parameters error', () => {

    it('Invalid slope case', () => {

        lin.construct(0, 1, 2);
        const result = lin.general();

        expect(result.ok).toBeFalsy();
        expect(result.mode).toBe(Mode.GENERAL);
        expect(result.explanation).toBe(FailCouse.BAD_SLOPE);
        expect(result.message).toBe(FailCouseMessage.M_BAD_SLOPE);
        expect(result.result).toBeUndefined();
    });

    it('Invalid modulus case', () => {

        lin.construct(1,1,0);
        const result = lin.general();

        expect(result.ok).toBeFalsy();
        expect(result.mode).toBe(Mode.GENERAL);
        expect(result.explanation).toBe(FailCouse.BAD_MODULUS);
        expect(result.message).toBe(FailCouseMessage.M_BAD_MODULUS);
        expect(result.result).toBeUndefined();
    });

    it('Invalid congruent case', () => {

        lin.construct(1,undefined,3);
        const result = lin.general();

        expect(result.ok).toBeFalsy();
        expect(result.mode).toBe(Mode.GENERAL);
        expect(result.explanation).toBe(FailCouse.BAD_CONGRUENT);
        expect(result.message).toBe(FailCouseMessage.M_BAD_CONGRUENT);
        expect(result.result).toBeUndefined();
    });
});

describe('Lincoln - linear congruence solver methods parameters error', () => {

    it('Invalid N first case', () => {

        lin.construct(6,8,4);
        expect(() => lin.first(-1)).toThrowError('N must be defined and must be greater than 1')
    });

    it('Invalid boundary case', () => {

        lin.construct(6,8,4);
        expect(() => lin.atBoundary(-1)).toThrowError('Boundary must be defined and must be greater than 1');
    });
});

