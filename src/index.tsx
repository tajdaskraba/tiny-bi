import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import { initialRawData } from './data/dataRaw';
import { createHierarchyData } from './data/dataTransform';

const root = d3.hierarchy(createHierarchyData(initialRawData, "root"));
const childrenData = root.children?.map(child => child.data);

const App = () => {
    return (
        <div>
            <div>
                <select name="status" id="status">
                    <option value="normal">normal</option>
                    <option value="skip">skip</option>
                    <option value="invert">invert</option>
                </select>
                <select name="variable" id="variable">
                    <option value="oct">oct</option>
                    <option value="nov">nov</option>
                    <option value="dec">dec</option>
                </select>
            </div>
            <div style={{border: '1px solid black'}}>
                <pre>
                    {JSON.stringify(childrenData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

// parent p has children c1, c2, c3. get c1.value + c2.value + c3.value
// export const getChildrenSum = (nodeName: string): number => {
//   const node = root.descendants().find(n => n.data.name === nodeName);
//   if (node) {
//     return nodeSum(node);
//   } else {
//     console.error(`Node with name ${nodeName} not found.`);
//     return 0;
//   }
// }

console.log("data", childrenData);