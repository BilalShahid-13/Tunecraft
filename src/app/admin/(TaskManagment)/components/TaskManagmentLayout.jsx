import { taskManagmentList } from '@/lib/Constant';
import AdminTabRoot from '../../components/AdminTabRoot';
import AllCrafters from './CraftersTab/AllCrafters';
import ApprovedCrafter from './CraftersTab/ApprovedCrafter';
import PendingCrafters from './CraftersTab/PendingCrafters';


const componentLists = [
  AllCrafters,
  PendingCrafters,
  ApprovedCrafter
]
export default function TaskManagmentLayout() {


  return (
    <>
      <AdminTabRoot
        list={taskManagmentList}
        gridSize={3}
        componentLists={componentLists} />
    </>
  )
}
