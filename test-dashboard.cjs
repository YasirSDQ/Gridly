const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const fixCatch = `    } catch (err: any) {
      console.log('Error caught in loadFiles:', err.message);
      if (err.message && err.message.includes("didn't find section in config file")) {
         console.log('Removing account', activeAccount.id);
         dispatch({ type: 'REMOVE_ACCOUNT', payload: activeAccount.id })
         addToast('warning', 'Account Removed', \`Account \${activeAccount.name} was removed because it is no longer authenticated.\`)
         setActiveAccount(null)
      } else {
         addToast('error', 'Failed to load files', err.message)
      }
    } finally {
      setLoading(false)
    }`;

code = code.replace(/    \} catch \(err: any\) \{[\s\S]*?    \} finally \{/m, fixCatch);

fs.writeFileSync('src/components/Dashboard.tsx', code);
