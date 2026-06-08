import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useTopBar() {
    const router = useRouter()
    const msg_size = ref(0)
    const openSettingView = () => {
        router.push('/setting')
    }
    return {
        msg_size,
        openSettingView
    }
}