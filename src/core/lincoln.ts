import { floor, gcd, xgcd } from "mathjs";
import { Mode } from "../enum/mode.enum";
import * as pure from "../pure/functions";
import { GeneralSolution } from "../type/general-solution.type";
import { SolverResult } from "../type/solver-result.type";
import { FailCouse } from "../enum/fail-couse.enum";
import { FailCouseMessage } from "../enum/fail-couse-message.enum";

export class Lincoln {


    private _slope?: number;
    private _modulus?: number;
    private _congruent?: number;

    /**
     * COEFF RIGHT PLUS
     */
    private CRP: Array<number> = [];
    /**
     * COEFF LEFT MINUS
     */
    private CLM: Array<number> = []; 
    /**
     * COEFF LEFT PLUS
     */
    private CLP: Array<number> = [];
    /**
     * COEFF RIGHT MINUS
     */
    private CRM: Array<number> = [];

    constructor() {}

    public construct(slope: number, congruent: number, modulus: number) {
        this._slope = slope;
        this._congruent = congruent;
        this._modulus = modulus;
    }

    public slope(slope: number) {
        this._slope = slope;
    }

    public getSlope(): number {
        return this._slope!;
    }

    public modulus(modulus: number) {
        this._modulus = modulus;
    }

    public getModulus(): number {
        return this._modulus!;
    }

    public congruent(congruent: number) {
        this._congruent = congruent;
    }

    public getCongruent(): number {
        return this._congruent!;
    }

    public lplus(...coeff: number[]): void {
        this.CLP.push(coeff.reduce(pure.sumOp(), 0));
    }

    public rplus(...coeff: number[]): void {
        this.CRP.push(coeff.reduce(pure.sumOp(), 0));
    }

    public lminus(...coeff: number[]): void {
        this.CLM.push(coeff.reduce(pure.sumOp(), 0));
    }

    public rminus(...coeff: number[]): void {
        this.CRM.push(coeff.reduce(pure.sumOp(), 0));
    }

    private minimalForm(): void {

        const leftAccumulator: number = Array.of(this.CLP, this.CLM.map(pure.opposite()))
            .flat()
            .filter(v => pure.exist(v))
            .reduce(pure.sumOp(), 0);

        const rightAccumulator: number = Array.of(this.CRP, this.CRM.map(pure.opposite()))
            .flat()
            .filter(v => pure.exist(v))
            .reduce(pure.sumOp(), 0);

        const leftResult = leftAccumulator - rightAccumulator;
        this._congruent -= leftResult;

        const greatestCommonDivisor = gcd(
            this._slope,
            this._congruent,
            this._modulus
        );

        if (greatestCommonDivisor !== 1) {
            const reducedCoeff = Array.of(
                this._slope, 
                this._congruent, 
                this._modulus
            ).map(coeff => coeff / greatestCommonDivisor);

            reducedCoeff.reverse();
            this._slope = reducedCoeff.pop()!;
            this._congruent = reducedCoeff.pop()!;
            this._modulus = reducedCoeff.pop()!;
        }
    }

    private preliminaryValidation(): SolverResult {

        if (!this._slope || this._slope === 0) {
            return this.fail(FailCouse.BAD_SLOPE, FailCouseMessage.M_BAD_SLOPE);
        }

        if (!this._modulus || this._modulus < 2) {
            return this.fail(FailCouse.BAD_MODULUS, FailCouseMessage.M_BAD_MODULUS);
        }

        if (!this._congruent) {
            return this.fail(FailCouse.BAD_CONGRUENT, FailCouseMessage.M_BAD_CONGRUENT);

        }

        return this.defaultSuccess();
    }

    private validateSolutionExistence(): SolverResult {
        
        if (!Number.isInteger(this._congruent / gcd(this._slope, this._modulus))) {
            return this.fail(FailCouse.SOLUTION_NOT_EXIST, FailCouseMessage.M_SOLUTION_NOT_EXIST);
        }

        return this.defaultSuccess();
    }

    private generalSolution(): GeneralSolution {

        //@ts-ignore
        const multiplicativeInverse = xgcd(this._slope, this._modulus)._data[1];
        //@ts-ignore
        let solution = multiplicativeInverse * this._congruent;

        solution = solution % this._modulus;
        
        if (solution < 0) {
            solution += this._modulus;
        }

        return {
            zeroPoint: solution,
            modulus: this._modulus
        };
    }

    private solve(mode: Mode, params?: any): SolverResult {

        const PV = this.preliminaryValidation();

        if (!PV.ok) {
            PV.mode = mode;
            return PV;
        }

        this.minimalForm();

        const VSE = this.validateSolutionExistence();

        if (!VSE.ok) {
            VSE.mode = mode;
            return VSE;
        }

        const general = this.generalSolution();
        let result: number | number[];

        switch(mode) {
            case Mode.GENERAL: {
                result = Array.of(general.zeroPoint, general.modulus);
                break;
            }
            case Mode.FIRST: {
                result = general.zeroPoint;
                break;
            }
            case Mode.FIRST_N: {
                result = [...Array(params.n).keys()].map(k => general.zeroPoint + k*general.modulus);
                break;
            }
            case Mode.BOUNDARY: {
        
                if (params.boundary! - general.zeroPoint < 0) {
                    result = [];
                }

                const lastOrbit = floor((params.boundary! - general.zeroPoint)/general.modulus);
                result = [...Array(lastOrbit + 1).keys()].map(k => general.zeroPoint + k*general.modulus);
                break;
            }
        }

        return this.repack(result, mode);
    }

    private fail(explanation: string, message: string): SolverResult {
        return {
            ok: false,
            mode: undefined,
            explanation,
            message,
            result: undefined
        };
    }

    private defaultSuccess(): SolverResult {
        return {
            ok: true,
            mode: undefined,
            explanation: undefined,
            message: undefined,
            result: undefined
        };
    }

    private repack(result: number | number[], mode: string): SolverResult {
        return {
            ok: true,
            mode,
            explanation: undefined,
            message: undefined,
            result
        };
    }

    public general(): SolverResult {
        return this.solve(Mode.GENERAL);
    }

    public first(n: number): SolverResult {
        
        if (!n || n < 1) {
            throw new Error('N must be defined and must be greater than 1')
        }

        return this.solve(Mode.FIRST_N, {n});
    }

    public firstOnly(): SolverResult {
        return this.solve(Mode.FIRST);
    }

    public atBoundary(boundary: number): SolverResult {

        if (!boundary || boundary < 1) {
            throw new Error('Boundary must be defined and must be greater than 1');
        }

        return this.solve(Mode.BOUNDARY, {boundary});
    }
}