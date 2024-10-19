export type SolverResult = {
    ok: boolean;
    mode: string;
    explanation: string | undefined;
    message: string | undefined;
    result: number[] | number | undefined;
};