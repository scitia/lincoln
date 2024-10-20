function opposite() {
    return (num: number) => num * (-1);
}

function sumOp() {
    return (acc: number, curr: number) => acc + curr;
}

function exist(value: any) {
    return !!value;
}

function existOp() {
    return (value: any) => !!value;
}

export {opposite, sumOp, exist};

