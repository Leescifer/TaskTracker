namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // Only return users with role = 'user'
        $users = User::where('role', 'user')->select('id', 'name', 'role')->get();

        return response()->json($users);
    }
}