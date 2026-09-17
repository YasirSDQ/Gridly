const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(/  \| \{ type: 'UPDATE_TRANSFER'; payload: \{ id: string; updates: Partial<TransferJob> \} \}/, `  | { type: 'ADD_TRANSFER'; payload: TransferJob }
  | { type: 'UPDATE_TRANSFER'; payload: { id: string; updates: Partial<TransferJob> } }`);

code = code.replace(/    case 'SET_TRANSFERS':\n      return \{ \.\.\.state, transfers: action\.payload \}/, `    case 'SET_TRANSFERS':
      return { ...state, transfers: action.payload }
    case 'ADD_TRANSFER':
      return { ...state, transfers: [action.payload, ...state.transfers] }`);

fs.writeFileSync('src/context/AppContext.tsx', code);
