import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Artist } from "@/types";

interface ArtistIntroduceProps {
  artist?: Artist;
}

const ArtistIntroduce = ({ artist }: ArtistIntroduceProps) => {
  return (
    <div className="absolute bottom-0">
      {/* Khối chứa ảnh + đoạn giới thiệu */}
      <div className="absolute bottom-0 w-[200px] left-7 rounded-lg z-10">
        {/* Ảnh nghệ sĩ */}
        <img
          src={artist?.imageUrl}
          alt="Anh tac gia"
          className="w-full h-[200px] object-cover"
        />
        <Dialog>
          <DialogTrigger className="absolute top-2 opacity-100 text-white font-bold text-xl mt-3 ml-5 hover:underline">
            Artist Introduce
          </DialogTrigger>
          <DialogContent className="w-[800px] max-w-[1000px] max-h-[560px] rounded-lg overflow-y-scroll scroll-smooth scrollbar ">
            <DialogHeader>
              <DialogTitle className="m-5 text-2xl font-bold text-white">
                <img
                  src={artist?.imageUrl}
                  alt="Anh tac gia"
                  className="w-full object-cover"
                />
              </DialogTitle>
              <DialogDescription>
                <div className="flex m-5">
                  <div className="">
                    <div className="mt-2">
                      <h2 className="text-5xl font-bold text-white">
                        {artist?.followers}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Người theo dõi
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-3xl font-semibold text-white">
                        {artist?.listeners}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Nguồn nghe hàng tháng
                      </p>
                    </div>
                    <div className="mt-6">
                      <div className="justify-between items-center">
                        <h4 className="text-lg font-medium text-white">
                          Hồ Chí Minh City, VN
                        </h4>
                        <p className="text-sm text-gray-400">
                          649.646 người nghe
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pl-20">
                    <p className="mt-4 text-sm text-gray-300">
                      {artist?.description}
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* PHẦN giới thiệu nằm dưới ảnh */}
      <div className="absolute w-[270px]">
        <div className="bg-zinc-900/95 text-white p-4 z-20">
          <h2 className="text-xl font-bold">{artist?.name}</h2>
          <p className="mt-5 text-base">
            {artist?.listeners} nguồn nghe hàng tháng
          </p>
          <p className="mt-5 text-base">
            <Dialog>
              <DialogTrigger className="block w-full text-left">
                {artist?.description}
              </DialogTrigger>
              <DialogContent className="w-[800px] max-w-[1000px] max-h-[560px] rounded-lg overflow-y-scroll scroll-smooth scrollbar ">
                <DialogHeader>
                  <DialogTitle className="m-5 text-2xl font-bold text-white">
                    <img
                      src="/artists/xiaomi.webp"
                      alt="Anh tac gia"
                      className="w-full object-cover"
                    />
                  </DialogTitle>
                  <DialogDescription>
                    <div className="flex m-5">
                      <div className="">
                        <div className="mt-2">
                          <h2 className="text-5xl font-bold text-white">
                            {artist?.followers}
                          </h2>
                          <p className="text-sm text-gray-400 mt-1">
                            Người theo dõi
                          </p>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-3xl font-semibold text-white">
                            {artist?.listeners}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Nguồn nghe hàng tháng
                          </p>
                        </div>
                        <div className="mt-6">
                          <div className="justify-between items-center">
                            <h4 className="text-lg font-medium text-white">
                              Hồ Chí Minh City, VN
                            </h4>
                            <p className="text-sm text-gray-400">
                              649.646 người nghe
                            </p>
                          </div>
                          <div className="mt-2 justify-between items-center">
                            <h4 className="text-lg font-medium text-white">
                              Hà Nội, VN
                            </h4>
                            <p className="text-sm text-gray-400">
                              547.195 người nghe
                            </p>
                          </div>
                          <div className="mt-2 justify-between items-center">
                            <h4 className="text-lg font-medium text-white">
                              Đà Nẵng, VN
                            </h4>
                            <p className="text-sm text-gray-400">
                              71.699 người nghe
                            </p>
                          </div>
                          <div className="mt-2 justify-between items-center">
                            <h4 className="text-lg font-medium text-white">
                              Biên Hòa, VN
                            </h4>
                            <p className="text-sm text-gray-400">
                              39.604 người nghe
                            </p>
                          </div>
                          <div className="mt-2 justify-between items-center">
                            <h4 className="text-lg font-medium text-white">
                              Cần Thơ, VN
                            </h4>
                            <p className="text-sm text-gray-400">
                              32.586 người nghe
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pl-20">
                        <p className="mt-4 text-sm text-gray-300">
                          {artist?.description}
                        </p>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>
        </div>

        {/* PHẦN THÔNG TIN TÓM TẮT – nằm riêng */}
        <div className="mt-6 mx-auto text-white bg-zinc-900/95 rounded-b-lg p-4">
          <div className="flex">
            <h2>Người tham gia thực hiện</h2>
            <button className="ml-auto px-4 py-1 text-white rounded hover:bg-white hover:text-black transition">
              Hiện tất cả
            </button>
          </div>
          <div className="flex mt-5">
            <div className="">
              <h3>{artist?.name}</h3>
            </div>
            <button className="ml-auto px-3 py-0 border border-white text-white rounded hover:bg-white hover:text-black transition">
              Theo dõi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistIntroduce;
