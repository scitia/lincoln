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

    set slope(slope: number) {
        this._slope = slope;
    }

    get slope(): number {
        return this._slope!;
    }

    set modulus(modulus: number) {
        this._modulus = modulus;
    }

    get modulus(): number {
        return this._modulus!;
    }

    set congruent(congruent: number) {
        this._congruent = congruent;
    }

    get congruent(): number {
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
        this.congruent -= leftResult;

        const greatestCommonDivisor = gcd(
            this.slope,
            this.congruent,
            this.modulus
        );

        if (greatestCommonDivisor !== 1) {
            const reducedCoeff = Array.of(
                this.slope, 
                this.congruent, 
                this.modulus
            ).map(coeff => coeff / greatestCommonDivisor);

            reducedCoeff.reverse();
            this.slope = reducedCoeff.pop()!;
            this.congruent = reducedCoeff.pop()!;
            this.modulus = reducedCoeff.pop()!;
        }
    }

    private preliminaryValidation(): void {

        if (!this.slope || this.slope === 0) {
            throw new Error('Linear coefficient of congruence must be non-zero and non null value');
        }

        if (!this.modulus || this.modulus < 2) {
            throw new Error('Modulus number must to be greater or equal 2');
        }

        if (!this.congruent) {
            throw new Error('Right side of the eqasion must be defined');
        }
    }

    private validateSolutionExistence(): void {
        
        const gcd_val = gcd(this.slope, this.modulus);
        if (!Number.isInteger(this.congruent / gcd_val)) {
            throw new Error('Linear congruence equasion has no solution!');
        }
    }

    private generalSolution() {

        this.preliminaryValidation();

        this.minimalForm();

        this.validateSolutionExistence();

        //@ts-ignore
        const multiplicativeInverse = xgcd(this.slope, this.modulus)._data[1];
        //@ts-ignore
        let solution = multiplicativeInverse * this.congruent;

        solution = solution % this.modulus;
        
        if (solution < 0) {
            solution += this.modulus;
        }

        return {
            zeroPoint: solution,
            modulus: this.modulus
        };
    }

    private solve(mode: Mode, boundary?: number): number[] {

        const general = this.generalSolution();

        switch(mode) {
            case Mode.BOUNDARY: {
        
                if (boundary! - general.zeroPoint < 0) {
                    return [];
                }

                const lastOrbit = floor((boundary! - general.zeroPoint)/general.modulus);
                return [...Array(lastOrbit + 1).keys()].map(k => general.zeroPoint + k*general.modulus);
            } 
            default: {
                return Array.of(general.zeroPoint, general.modulus);
            }
        }
    }

    public atBoundary(boundary: number): number[] {

        if (!boundary || boundary < 1) {
            throw new Error('Boundary must be defined and must be greater than 1');
        }

        return this.solve(Mode.BOUNDARY, boundary);
    }

    public general(): number[] {
        return this.solve(Mode.GENERAL);
    }
}