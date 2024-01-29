function getColumn(colNumber, lines)
{
    const col = [];
    for (let i = 0; i < lines.length; ++i)
    {
        const line = lines[i];
        col.push(line[colNumber]);
    }
    return col;
}

function getAllowed(column, picks)
{
    const choosable = [];
    for (let i = 0; i < picks.length; ++i)
    {
        const pick = picks[i];
        if (!column.includes(pick))
        {
            choosable.push(pick);
        }
    }
    return choosable;
}

function getSquare(colNumber, lineNumber, lines)
{
    const detected = [];
    if (!lineNumber)
    {
        return detected;
    }

    let startCol = Math.floor(colNumber / 3) * 3;
    let endCol = startCol + 3;

    let startLine = Math.floor(lineNumber / 3) * 3;
    let endLine = Math.min(startLine + 3, lines.length);

    for (let i = startCol; i < endCol; ++i)
    {
        for (let j = startLine; j < endLine; ++j)
        {
            const item = lines[j][i];
            if (item !== undefined)
            {
                detected.push(item);
            }
        }
    }

    return detected;
}

function generateRandomLine(lines)
{
    const line = [];
    let selectables = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; ++i)
    {
        const column = getColumn(i, lines);

        let allowed;

        // remove column items
        allowed = getAllowed(column, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

        // remove line items
        allowed = getAllowed(line, allowed);

        // remove square items
        const square = getSquare(i, lines.length, lines);
        allowed = getAllowed(square, allowed);

        const random = allowed.length > 1 ? Math.floor(Math.random() * allowed.length) : 0;

        const chosen = allowed[random];
        if (chosen === undefined)
        {
            return false;
        }
        line.push(chosen);

        selectables.splice(selectables.indexOf(chosen), 1);
    }

    return line;
}

function generateGrid()
{
    let iterations;
    do
    {
        const grid = [];
        iterations = 0;
        do
        {
            ++iterations;
            if (iterations > 500)
            {
                iterations = -1;
                break;
            }

            const line = generateRandomLine(grid);
            if (!line)
            {
                continue;
            }
            grid.push(line);


        } while (grid.length < 9);

        if (iterations !== -1)
        {
            return grid;
        }

    } while (true);
}

const displayGrid = () =>
{
    const grid = generateGrid();
    console.log(grid);
};

// a function to dig holes in a and replace random values with 0
function digHoles(array, holes)
{
    let newArray = array.map(row => row.slice());
    holes = (parseInt(holes) > 80 || holes <= null) ? 63 : holes;
    let dug = new Set();
    for (let i = 0; i < holes; i++)
    {
        let row, col;
        do
        {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        while (dug.has(row * 9 + col));
        newArray[row][col] = 0;
        dug.add(row * 9 + col);
    }
    return newArray;
}

export { digHoles, generateGrid };