import { floor, gcd, xgcd } from "mathjs";
import { Mode } from "../enum/mode.enum";
import * as pure from "../pure/functions";

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
            .filter(pure.exist)
            .reduce(pure.sumOp(), 0);

        const rightAccumulator: number = Array.of(this.CRP, this.CRM.map(pure.opposite()))
            .flat()
            .filter(pure.exist)
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

    private preliminaryValidation(): void {

        if (!this.slope || this._slope === 0) {
            throw new Error('Linear coefficient of congruence must be non-zero and non null value');
        }

        if (!this.modulus || this._modulus < 2) {
            throw new Error('Modulus number must to be greater or equal 2');
        }

        if (!this.congruent) {
            throw new Error('Right side of the eqasion must be defined');
        }
    }

    private validateSolutionExistence(): void {
        
        const gcd_val = gcd(this._slope, this._modulus);
        if (!Number.isInteger(this._congruent / gcd_val)) {
            throw new Error('Linear congruence equasion has no solution!');
        }
    }

    private generalSolution() {

        this.preliminaryValidation();

        this.minimalForm();

        this.validateSolutionExistence();

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

    private solve(mode: Mode, params?: any): number[] {

        const general = this.generalSolution();

        switch(mode) {
            case Mode.BOUNDARY: {
        
                if (params.boundary! - general.zeroPoint < 0) {
                    return [];
                }

                const lastOrbit = floor((params.boundary! - general.zeroPoint)/general.modulus);
                return [...Array(lastOrbit + 1).keys()].map(k => general.zeroPoint + k*general.modulus);
            }
            case Mode.FIRST_N: {
                return [...Array(params.n).keys()].map(k => general.zeroPoint + k*general.modulus);
            }
            case Mode.FIRST: {
                return Array.of(general.zeroPoint);
            }
            // Equivalent to Mode.GENERAL
            default: {
                return Array.of(general.zeroPoint, general.modulus);
            }
        }
    }

    public first(n: number): number[] {
        
        if (!n || n < 1) {
            throw new Error('N must be defined and must be greater than 1')
        }

        return this.solve(Mode.FIRST_N, {n});
    }

    public firstOnly(): number {
        return this.solve(Mode.FIRST)[0];
    }

    public atBoundary(boundary: number): number[] {

        if (!boundary || boundary < 1) {
            throw new Error('Boundary must be defined and must be greater than 1');
        }

        return this.solve(Mode.BOUNDARY, {boundary});
    }

    public general(): number[] {
        return this.solve(Mode.GENERAL);
    }
}